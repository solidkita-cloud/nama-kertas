import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import type { Story, Reply } from '../types';
import { INITIAL_STORIES, INITIAL_REPLIES } from '../data/initialStories';

const LOCAL_STORIES_KEY = 'nama_kertas_stories_v2';
const LOCAL_REPLIES_KEY = 'nama_kertas_replies_v2';
const LOCAL_DRAFTS_KEY = 'nama_kertas_local_drafts_v1';

// 0. Local Drafts Management (100% di perangkat ini saja, tidak pernah dikirim ke Firestore)
export function getLocalDrafts(): Story[] {
  try {
    const raw = localStorage.getItem(LOCAL_DRAFTS_KEY);
    let drafts: Story[] = raw ? JSON.parse(raw) : [];

    // Migrasi 1: Cek apakah ada draf lama di key nama_kertas_stories_v2
    if (drafts.length === 0) {
      const oldStoriesRaw = localStorage.getItem(LOCAL_STORIES_KEY);
      if (oldStoriesRaw) {
        const oldStories: Story[] = JSON.parse(oldStoriesRaw);
        const oldDrafts = oldStories.filter((s) => s.visibility === 'DRAFT');
        if (oldDrafts.length > 0) {
          drafts = oldDrafts;
          localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(drafts));
        }
      }
    }

    // Migrasi 2: Pastikan draf "Bising" terselamatkan dan otomatis dipulihkan ke perangkat
    const hasRestoredBising = localStorage.getItem('nama_kertas_bising_restored_v1');
    if (drafts.length === 0 && !hasRestoredBising) {
      const bisingDraft: Story = {
        id: 'draft-bising-restored',
        authorPaperName: 'pena hijau',
        authorId: 'user-pena-hijau',
        title: 'Bising',
        content:
          'bising, rasanya seperti kegelisahan yang terasing. Engkau ada tapi engkau juga tak ada di waktu yang sama. Bising rasanya, seakan semua tak ada dan hanya aku yang mendengarnya. kegundahan dalam letupan amarah dihadapkan dengan kegelisahan. Bising rasanya, tiada rasa suka dengan segala kekalutan seakan semua menjadikanku terbununh dalam kegundahan yang dengan ketidak sengajaan engkau ciptakan.',
        rasa: 'KALUT',
        musicTheme: 'Sepi Pelan',
        visibility: 'DRAFT',
        allowReplies: true,
        readingTimeMinutes: 1,
        createdAt: '24 Nov 2026',
        isSaved: false,
      };
      drafts = [bisingDraft];
      localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(drafts));
      localStorage.setItem('nama_kertas_bising_restored_v1', 'true');
    }

    return drafts;
  } catch {
    return [];
  }
}

export function saveLocalDraft(draft: Story): Story {
  const drafts = getLocalDrafts();
  const id = draft.id && draft.id.startsWith('draft-') ? draft.id : `draft-${Date.now()}`;
  const draftToSave: Story = {
    ...draft,
    id,
    visibility: 'DRAFT',
  };
  const updated = [draftToSave, ...drafts.filter((d) => d.id !== id)];
  localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(updated));
  return draftToSave;
}

export function deleteLocalDraft(draftId: string): void {
  const drafts = getLocalDrafts();
  const updated = drafts.filter((d) => d.id !== draftId);
  localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(updated));
}

// 1. Fetch Stories (Firestore with Initial Seeding & Offline Fallback)
export async function getStories(): Promise<Story[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'stories');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .filter((s: any) => s.visibility !== 'DRAFT') as Story[];
      } else {
        // First-time seed into Firestore so the database is pre-populated
        for (const story of INITIAL_STORIES) {
          try {
            await addDoc(colRef, {
              ...story,
              serverCreatedAt: serverTimestamp(),
            });
          } catch (e) {
            console.warn('Seeding failed (check Firestore rules):', e);
          }
        }
        return INITIAL_STORIES;
      }
    } catch (err) {
      console.warn('Firebase fetch failed, fallback to local storage:', err);
    }
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(LOCAL_STORIES_KEY);
  return saved ? JSON.parse(saved) : INITIAL_STORIES;
}

// 2. Save / Publish Story (Drafts stay 100% local, Published go to Firestore)
export async function saveStory(story: Story): Promise<Story> {
  // JIKA DRAF: 100% LOKAL DI PERANGKAT INI SAJA, JANGAN PERNAH SIMPAN KE CLOUD FIRESTORE!
  if (story.visibility === 'DRAFT') {
    return saveLocalDraft(story);
  }

  // JIKA DITERBITKAN: Bersihkan dari draf lokal jika sebelumnya berupa draf
  if (story.id && story.id.startsWith('draft-')) {
    deleteLocalDraft(story.id);
  }

  const createdStory = { ...story };

  if (isFirebaseConfigured && db) {
    try {
      const dataToSave = {
        authorPaperName: story.authorPaperName,
        authorId: story.authorId,
        title: story.title,
        content: story.content,
        rasa: story.rasa,
        musicTheme: story.musicTheme,
        visibility: story.visibility,
        allowReplies: story.allowReplies,
        readingTimeMinutes: story.readingTimeMinutes,
        createdAt: story.createdAt,
        isSaved: Boolean(story.isSaved),
        quarantineDetails: story.quarantineDetails || null,
        serverCreatedAt: serverTimestamp(),
      };

      if (story.id && !story.id.startsWith('story-temp-') && !story.id.startsWith('story-17') && !story.id.startsWith('draft-')) {
        await setDoc(doc(db, 'stories', story.id), dataToSave, { merge: true });
        createdStory.id = story.id;
      } else {
        const docRef = await addDoc(collection(db, 'stories'), dataToSave);
        createdStory.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firebase save failed, saving locally:', err);
    }
  }

  // Always update localStorage as cache / offline support
  const local = localStorage.getItem(LOCAL_STORIES_KEY);
  const list: Story[] = local ? JSON.parse(local) : INITIAL_STORIES;
  const updated = [createdStory, ...list.filter((s) => s.id !== createdStory.id)];
  localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(updated));

  return createdStory;
}

// 3. Delete Story
export async function deleteStory(storyId: string): Promise<void> {
  if (storyId.startsWith('draft-')) {
    deleteLocalDraft(storyId);
    return;
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'stories', storyId));
    } catch (err) {
      console.warn('Firebase delete failed:', err);
    }
  }

  const local = localStorage.getItem(LOCAL_STORIES_KEY);
  if (local) {
    const list: Story[] = JSON.parse(local);
    const updated = list.filter((s) => s.id !== storyId);
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(updated));
  }
}

// 4. Fetch Replies for a Story
export async function getReplies(storyId: string): Promise<Reply[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'replies'),
        where('storyId', '==', storyId),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Reply[];
      }
    } catch (err) {
      console.warn('Firebase replies fetch failed, fallback to local:', err);
    }
  }

  const saved = localStorage.getItem(LOCAL_REPLIES_KEY);
  const allReplies: Reply[] = saved ? JSON.parse(saved) : INITIAL_REPLIES;
  return allReplies.filter((r) => r.storyId === storyId);
}

// 5. Add Reply
export async function addReply(reply: Reply): Promise<Reply> {
  const created = { ...reply };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'replies'), {
        storyId: reply.storyId,
        authorPaperName: reply.authorPaperName,
        authorId: reply.authorId,
        parentReplyId: reply.parentReplyId || null,
        tier: reply.tier,
        content: reply.content,
        createdAt: reply.createdAt,
        serverCreatedAt: serverTimestamp(),
      });
      created.id = docRef.id;
    } catch (err) {
      console.warn('Firebase addReply failed:', err);
    }
  }

  const saved = localStorage.getItem(LOCAL_REPLIES_KEY);
  const allReplies: Reply[] = saved ? JSON.parse(saved) : INITIAL_REPLIES;
  const updated = [created, ...allReplies];
  localStorage.setItem(LOCAL_REPLIES_KEY, JSON.stringify(updated));

  return created;
}
