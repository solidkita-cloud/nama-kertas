import React, { useState, useEffect, useRef } from 'react';
import {
  type Rasa,
  type Story,
  type Reply,
  type User as UserType,
  type StoryVisibility,
  type QuarantineDetails,
} from './types';
import { INITIAL_STORIES, INITIAL_REPLIES } from './data/initialStories';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterRasaBar } from './components/FilterRasaBar';
import { StoryCard } from './components/StoryCard';
import { StoryReader } from './components/StoryReader';
import { WriteEditor } from './components/WriteEditor';
import { QuarantineView } from './components/QuarantineView';
import { BottomPhilosophyCards } from './components/BottomPhilosophyCards';
import { RenameModal } from './components/RenameModal';
import { AgeGateModal } from './components/AgeGateModal';
import { SupportModal } from './components/SupportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PaperIntroSplash } from './components/PaperIntroSplash';
import { audioEngine } from './utils/audioEngine';
import { inspectContent } from './utils/contentModeration';
import {
  getStories,
  saveStory as saveStoryToDb,
  deleteStory as deleteStoryFromDb,
  addReply as addReplyToDb,
  getLocalDrafts,
} from './services/storyService';

function sanitizeStories(list: Story[]): Story[] {
  return list.map((story) => {
    if (story.visibility === 'QUARANTINED') return story;
    const safety = inspectContent(story.title || '', story.content || '');
    if (safety.isQuarantined) {
      return {
        ...story,
        visibility: 'QUARANTINED' as StoryVisibility,
        quarantineDetails: {
          category: safety.category || 'TERLARANG',
          categoryLabel: safety.categoryLabel || 'Konten Terlarang',
          reason: safety.reasonText,
          matchedWords: safety.matchedKeywords,
          quarantinedAt: story.createdAt,
        },
      };
    }
    return story;
  });
}

const LOCAL_MY_STORIES_KEY = 'nama_kertas_my_story_ids_v1';

function getInitialUser(): UserType {
  const saved = localStorage.getItem('nama_kertas_user_v2');
  if (saved) {
    try {
      const parsed: UserType = JSON.parse(saved);
      // Ganti id lama 'user-pena-hijau' menjadi ID acak unik per-perangkat agar tidak tertukar dengan pengguna lain
      if (!parsed.id || parsed.id === 'user-pena-hijau') {
        const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
          ? `user-${crypto.randomUUID()}`
          : `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        parsed.id = uniqueId;
        localStorage.setItem('nama_kertas_user_v2', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // fallback
    }
  }

  const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? `user-${crypto.randomUUID()}`
    : `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id: uniqueId,
    paperName: 'pena hijau',
    email: 'penahijau@namakertas.local',
    isAdultVerified: false,
    paperNameLastChanged: '23 November 2026',
    isLoggedIn: true,
  };
}

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<'FEED' | 'READER' | 'WRITE' | 'QUARANTINE'>('FEED');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedRasaFilter, setSelectedRasaFilter] = useState<Rasa | 'ALL'>('ALL');
  const [onlySavedFilter, setOnlySavedFilter] = useState(false);
  const [onlyDraftsFilter, setOnlyDraftsFilter] = useState(false);
  const [draftToEdit, setDraftToEdit] = useState<Story | null>(null);
  const [localDrafts, setLocalDrafts] = useState<Story[]>(() => getLocalDrafts());
  const [myStoryIds, setMyStoryIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_MY_STORIES_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      // Daftarkan cerita asli milik pengguna di browser ini (Kisi, Bising, dll.)
      const knownIds = ['5vxg7IN7GXtp9erzaW0a', '2GADvhf4LHdMSaGiXwRU', 'MH6tKhZN75ddsCMRhyhP', 'U2IPLSN1a39GI7UUWfJt', 'gPG8j1t1MyRfVmQueAt5'];
      const merged = Array.from(new Set([...list, ...knownIds]));
      localStorage.setItem(LOCAL_MY_STORIES_KEY, JSON.stringify(merged));
      return merged;
    } catch {
      return [];
    }
  });

  // Modals state
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Stories & Replies state
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('nama_kertas_stories_v2');
    const parsed: Story[] = saved ? JSON.parse(saved) : INITIAL_STORIES;
    return sanitizeStories(parsed);
  });

  const [replies, setReplies] = useState<Reply[]>(() => {
    const saved = localStorage.getItem('nama_kertas_replies_v2');
    return saved ? JSON.parse(saved) : INITIAL_REPLIES;
  });

  // User state (Setiap perangkat dijamin memiliki ID unik anonim)
  const [currentUser, setCurrentUser] = useState<UserType>(() => getInitialUser());

  // Shortcut keyboard rahasia untuk buka Kunci Kurator (Ctrl + Shift + A)
  useEffect(() => {
    const handleAdminShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  }, []);

  // Modal 18+ baru dibuka setelah welcome splash ("masa welcome yang keren tadi") selesai
  const [isAgeGateOpen, setIsAgeGateOpen] = useState(false);

  useEffect(() => {
    if (!showIntro && !currentUser.isAdultVerified) {
      setIsAgeGateOpen(true);
    }
  }, [showIntro, currentUser.isAdultVerified]);

  // Load from Firestore on mount (with auto-sanitization)
  useEffect(() => {
    getStories().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setStories(sanitizeStories(fetched));
      }
    });
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('nama_kertas_stories_v2', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('nama_kertas_replies_v2', JSON.stringify(replies));
  }, [replies]);

  useEffect(() => {
    localStorage.setItem('nama_kertas_user_v2', JSON.stringify(currentUser));
  }, [currentUser]);

  // Section ref to scroll smoothly from hero or cards
  const storiesSectionRef = useRef<HTMLDivElement>(null);

  const scrollToStories = () => {
    storiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Bookmark story
  const handleToggleSave = (storyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, isSaved: !s.isSaved } : s))
    );
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  // Delete from quarantine
  const handleDeleteStory = (storyId: string) => {
    deleteStoryFromDb(storyId);
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    setLocalDrafts((prev) => prev.filter((d) => d.id !== storyId));
  };

  // Add Reply
  const handleAddReply = (
    storyId: string,
    parentReplyId: string | null,
    tier: 1 | 2 | 3,
    content: string
  ) => {
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      storyId,
      authorPaperName: currentUser.paperName,
      authorId: currentUser.id,
      parentReplyId,
      tier,
      content,
      createdAt: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    };

    addReplyToDb(newReply).then((saved) => {
      setReplies((prev) => [saved, ...prev.filter((r) => r.id !== newReply.id)]);
    });
  };

  // Publish Story
  const handlePublishStory = (data: {
    id?: string;
    title: string;
    content: string;
    rasa: Rasa;
    visibility: StoryVisibility;
    allowReplies: boolean;
    quarantineDetails?: QuarantineDetails;
  }) => {
    const wordCount = data.content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    const musicMap: Record<Rasa, string> = {
      KALUT: 'Sepi Pelan',
      GUNJING: 'Hujan Pelan',
      HARDIK: 'Angin Sunyi',
      RINDU: 'Biru Malam',
      TENANG: 'Kertas Pagi',
    };

    const targetId = data.id || (data.visibility === 'DRAFT' ? `draft-${Date.now()}` : `story-${Date.now()}`);

    const newStory: Story = {
      id: targetId,
      authorPaperName: currentUser.paperName,
      authorId: currentUser.id,
      title: data.title || 'Tanpa Judul',
      content: data.content,
      rasa: data.rasa,
      musicTheme: musicMap[data.rasa],
      visibility: data.visibility,
      allowReplies: data.allowReplies,
      readingTimeMinutes,
      createdAt: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
      isSaved: false,
      quarantineDetails: data.quarantineDetails,
    };

    saveStoryToDb(newStory).then((saved) => {
      setLocalDrafts(getLocalDrafts());
      if (data.visibility !== 'DRAFT') {
        setStories((prev) => [saved, ...prev.filter((s) => s.id !== targetId)]);
        setMyStoryIds((prev) => {
          const updated = Array.from(new Set([...prev, targetId, saved.id]));
          localStorage.setItem(LOCAL_MY_STORIES_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    });

    if (data.visibility === 'QUARANTINED') {
      setCurrentView('QUARANTINE');
    } else if (data.visibility === 'DRAFT') {
      setCurrentView('FEED');
      setOnlyDraftsFilter(true);
      setDraftToEdit(null);
      alert('Draf berhasil disimpan di perangkat ini. Hanya kamu di perangkat ini yang dapat melihat dan melanjutkannya.');
    } else {
      setDraftToEdit(null);
      setSelectedStory(newStory);
      setCurrentView('READER');
    }
  };

  // Quarantined stories count
  const quarantinedStories = stories.filter((s) => s.visibility === 'QUARANTINED');

  // Filtered stories (EXCLUDE QUARANTINED and DRAFT from public feed, Defense-in-Depth against toxic content)
  const filteredStories = onlyDraftsFilter
    ? localDrafts
    : stories.filter((story) => {
        if (story.visibility === 'QUARANTINED' || story.visibility === 'DRAFT') return false;
        const safety = inspectContent(story.title || '', story.content || '');
        if (safety.isQuarantined) return false;
        if (onlySavedFilter && !story.isSaved) return false;
        if (selectedRasaFilter !== 'ALL' && story.rasa !== selectedRasaFilter) return false;
        return true;
      });

  const savedCount = stories.filter((s) => s.isSaved && s.visibility !== 'QUARANTINED').length;

  // Indeks dan navigasi cerita sebelumnya / selanjutnya di atas meja
  const currentStoryIndex = selectedStory
    ? filteredStories.findIndex((s) => s.id === selectedStory.id)
    : -1;
  const prevStory = currentStoryIndex > 0 ? filteredStories[currentStoryIndex - 1] : null;
  const nextStory =
    currentStoryIndex >= 0 && currentStoryIndex < filteredStories.length - 1
      ? filteredStories[currentStoryIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6EE] text-[#172132] font-sans antialiased selection:bg-[#E2D8C3]">
      {/* 0. INTRO SPLASH ("sruuttt.... warna cream kertas, tulisan latin sambung Nama Kertas, lalu terbang") */}
      {showIntro && (
        <PaperIntroSplash onComplete={() => setShowIntro(false)} />
      )}

      {/* Header */}
      <Header
        currentUser={currentUser}
        onOpenRename={() => setIsRenameOpen(true)}
        onOpenWrite={() => {
          setSelectedStory(null);
          setDraftToEdit(null);
          setCurrentView('WRITE');
        }}
        onGoHome={() => {
          setSelectedStory(null);
          setOnlyDraftsFilter(false);
          setOnlySavedFilter(false);
          setCurrentView('FEED');
        }}
        onReplayIntro={() => setShowIntro(true)}
        onOpenQuarantine={() => {
          setSelectedStory(null);
          setCurrentView('QUARANTINE');
        }}
        quarantineCount={quarantinedStories.length}
        draftCount={localDrafts.length}
        onOpenDrafts={() => {
          setSelectedStory(null);
          setOnlyDraftsFilter(true);
          setOnlySavedFilter(false);
          setSelectedRasaFilter('ALL');
          setCurrentView('FEED');
          scrollToStories();
        }}
        currentAmbientRasa={
          selectedStory ? selectedStory.rasa : selectedRasaFilter !== 'ALL' ? selectedRasaFilter : 'GUNJING'
        }
        onToggleAdmin={() => {
          if (currentUser.isAdmin) {
            if (window.confirm('Keluar dari Mode Admin / Kurator Meja?')) {
              setCurrentUser((prev) => ({ ...prev, isAdmin: false }));
            }
          } else {
            setIsAdminModalOpen(true);
          }
        }}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentView === 'READER' && selectedStory ? (
          /* VIEW: SATU CERITA, SATU LAYAR (dengan auto-check keamanan konten) */
          inspectContent(selectedStory.title || '', selectedStory.content || '').isQuarantined && !currentUser.isAdmin ? (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <p className="font-serif italic text-sm text-red-700">
                Surat ini telah dipindahkan ke ruang karantina karena melanggar etika kertas (terdeteksi ujaran terlarang/SARA).
              </p>
              <button
                onClick={() => {
                  setSelectedStory(null);
                  setCurrentView('FEED');
                }}
                className="px-5 py-2 rounded-full bg-[#172132] text-white text-xs cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            <StoryReader
              story={selectedStory}
              replies={replies.filter((r) => r.storyId === selectedStory.id)}
              currentUser={currentUser}
              myPublishedStoryIds={myStoryIds}
              onBack={() => {
                setSelectedStory(null);
                setCurrentView('FEED');
              }}
              onToggleSave={handleToggleSave}
              onAddReply={handleAddReply}
              onRequestLogin={() => setIsRenameOpen(true)}
              onDeleteStory={handleDeleteStory}
              prevStory={prevStory}
              nextStory={nextStory}
              currentIndex={currentStoryIndex}
              totalStories={filteredStories.length}
              onNavigateStory={(nextS) => {
                setSelectedStory(nextS);
              }}
            />
          )
        ) : currentView === 'WRITE' ? (
          /* VIEW: TULIS AJA */
          <WriteEditor
            currentUser={currentUser}
            onPublishStory={handlePublishStory}
            onBack={() => {
              setDraftToEdit(null);
              setCurrentView('FEED');
            }}
            onOpenSupport={() => setIsSupportOpen(true)}
            onViewQuarantine={() => setCurrentView('QUARANTINE')}
            draftToEdit={draftToEdit}
            availableDrafts={localDrafts}
            onSelectDraft={(d) => setDraftToEdit(d)}
          />
        ) : currentView === 'QUARANTINE' ? (
          /* VIEW: RUANG KARANTINA BERLAPIS (KHUSUS ADMIN) */
          currentUser.isAdmin ? (
            <QuarantineView
              quarantinedStories={quarantinedStories}
              onBack={() => setCurrentView('FEED')}
              onDeleteStory={handleDeleteStory}
            />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <p className="font-serif italic text-sm text-[#7A746A]">
                Ruang Karantina hanya dapat diakses oleh Kurator / Admin resmi.
              </p>
              <button
                onClick={() => setCurrentView('FEED')}
                className="px-5 py-2 rounded-full bg-[#172132] text-white text-xs cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          )
        ) : (
          /* VIEW: FEED (EXACTLY MATCHING THE USER'S SCREENSHOTS) */
          <>
            {/* 1. Hero Section */}
            <HeroSection
              onStartWriting={() => {
                setDraftToEdit(null);
                setCurrentView('WRITE');
              }}
              onScrollToStories={scrollToStories}
            />

            {/* 2. Filter Rasa & Stories List (Kenali Rasamu menyatu langsung di sini) */}
            <section ref={storiesSectionRef} className="py-12 max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
              <FilterRasaBar
                selectedRasa={selectedRasaFilter}
                onSelectFilter={(rasa) => {
                  setSelectedRasaFilter(rasa);
                  setOnlySavedFilter(false);
                  setOnlyDraftsFilter(false);
                  if (rasa !== 'ALL') audioEngine.play(rasa);
                }}
                onOpenSaved={() => {
                  setOnlySavedFilter(!onlySavedFilter);
                  setOnlyDraftsFilter(false);
                }}
                savedCount={savedCount}
                onlySavedFilter={onlySavedFilter}
                draftCount={localDrafts.length}
                onlyDraftsFilter={onlyDraftsFilter}
                onOpenDrafts={() => {
                  setOnlyDraftsFilter(!onlyDraftsFilter);
                  setOnlySavedFilter(false);
                }}
              />

              {onlySavedFilter && (
                <div className="text-xs text-[#7A746A] italic">
                  Menampilkan cerita yang kamu simpan ({filteredStories.length})
                </div>
              )}

              {/* Story Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredStories.length === 0 ? (
                  <div className="col-span-full py-16 text-center italic text-xs text-[#8A847A] border border-dashed border-[#DCD5C3] rounded-2xl p-8 bg-white/40">
                    {onlyDraftsFilter
                      ? 'Kamu belum memiliki draf tersimpan.'
                      : 'Belum ada cerita dengan rasa ini. Kamu bisa menjadi yang pertama menaruh cerita.'}
                  </div>
                ) : (
                  filteredStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      currentUser={currentUser}
                      onSelect={(s) => {
                        setSelectedStory(s);
                        setCurrentView('READER');
                      }}
                      onToggleSave={handleToggleSave}
                      onDeleteStory={handleDeleteStory}
                      onEditDraft={(draft) => {
                        setDraftToEdit(draft);
                        setCurrentView('WRITE');
                      }}
                    />
                  ))
                )}
              </div>
            </section>

            {/* 4. Bottom Philosophy Cards & Footer */}
            <BottomPhilosophyCards />
          </>
        )}
      </main>

      {/* Rename Modal */}
      <RenameModal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        currentName={currentUser.paperName}
        onSaveName={(newName) =>
          setCurrentUser((prev) => ({
            ...prev,
            paperName: newName,
            paperNameLastChanged: 'Baru saja diubah',
          }))
        }
      />

      {/* Age Gate Modal (18+) */}
      <AgeGateModal
        isOpen={isAgeGateOpen}
        onConfirm={() => {
          setCurrentUser((prev) => ({ ...prev, isAdultVerified: true }));
          setIsAgeGateOpen(false);
        }}
        onReject={() => {
          alert('Terima kasih. Nama Kertas mematuhi aturan usia 18+ (PP 17/2025). Kamu dialihkan.');
          window.location.href = 'https://www.google.com';
        }}
        isNightMode={false}
      />

      {/* Support / Crisis Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        isNightMode={false}
      />

      {/* Admin Login Modal (Dilindungi Kata Sandi) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setCurrentUser((prev) => ({ ...prev, isAdmin: true }));
        }}
      />
    </div>
  );
}

export default App;
