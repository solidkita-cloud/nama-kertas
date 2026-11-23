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
import { LimaRasaCards } from './components/LimaRasaCards';
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
import {
  getStories,
  saveStory as saveStoryToDb,
  deleteStory as deleteStoryFromDb,
  addReply as addReplyToDb,
} from './services/storyService';

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<'FEED' | 'READER' | 'WRITE' | 'QUARANTINE'>('FEED');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedRasaFilter, setSelectedRasaFilter] = useState<Rasa | 'ALL'>('GUNJING');
  const [onlySavedFilter, setOnlySavedFilter] = useState(false);

  // Modals state
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Stories & Replies state
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('nama_kertas_stories_v2');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [replies, setReplies] = useState<Reply[]>(() => {
    const saved = localStorage.getItem('nama_kertas_replies_v2');
    return saved ? JSON.parse(saved) : INITIAL_REPLIES;
  });

  // User state
  const [currentUser, setCurrentUser] = useState<UserType>(() => {
    const saved = localStorage.getItem('nama_kertas_user_v2');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-pena-hijau',
          paperName: 'pena hijau',
          email: 'penahijau@namakertas.local',
          isAdultVerified: false,
          paperNameLastChanged: '23 November 2026',
          isLoggedIn: true,
        };
  });

  // Modal 18+ baru dibuka setelah welcome splash ("masa welcome yang keren tadi") selesai
  const [isAgeGateOpen, setIsAgeGateOpen] = useState(false);

  useEffect(() => {
    if (!showIntro && !currentUser.isAdultVerified) {
      setIsAgeGateOpen(true);
    }
  }, [showIntro, currentUser.isAdultVerified]);

  // Load from Firestore on mount
  useEffect(() => {
    getStories().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setStories(fetched);
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

    const newStory: Story = {
      id: `story-${Date.now()}`,
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
      setStories((prev) => [saved, ...prev.filter((s) => s.id !== newStory.id)]);
    });

    if (data.visibility === 'QUARANTINED') {
      setCurrentView('QUARANTINE');
    } else if (data.visibility === 'DRAFT') {
      setCurrentView('FEED');
      alert('Ceritamu berhasil disimpan di draf pribadimu.');
    } else {
      setSelectedStory(newStory);
      setCurrentView('READER');
    }
  };

  // Quarantined stories count
  const quarantinedStories = stories.filter((s) => s.visibility === 'QUARANTINED');

  // Filtered stories (EXCLUDE QUARANTINED and DRAFT from public feed)
  const filteredStories = stories.filter((story) => {
    if (story.visibility === 'QUARANTINED' || story.visibility === 'DRAFT') return false;
    if (onlySavedFilter && !story.isSaved) return false;
    if (selectedRasaFilter !== 'ALL' && story.rasa !== selectedRasaFilter) return false;
    return true;
  });

  const savedCount = stories.filter((s) => s.isSaved && s.visibility !== 'QUARANTINED').length;

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
          setCurrentView('WRITE');
        }}
        onGoHome={() => {
          setSelectedStory(null);
          setCurrentView('FEED');
        }}
        onReplayIntro={() => setShowIntro(true)}
        onOpenQuarantine={() => {
          setSelectedStory(null);
          setCurrentView('QUARANTINE');
        }}
        quarantineCount={quarantinedStories.length}
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
          /* VIEW: SATU CERITA, SATU LAYAR */
          <StoryReader
            story={selectedStory}
            replies={replies.filter((r) => r.storyId === selectedStory.id)}
            currentUser={currentUser}
            onBack={() => {
              setSelectedStory(null);
              setCurrentView('FEED');
            }}
            onToggleSave={handleToggleSave}
            onAddReply={handleAddReply}
            onRequestLogin={() => setIsRenameOpen(true)}
            onDeleteStory={handleDeleteStory}
          />
        ) : currentView === 'WRITE' ? (
          /* VIEW: TULIS AJA */
          <WriteEditor
            currentUser={currentUser}
            onPublishStory={handlePublishStory}
            onBack={() => setCurrentView('FEED')}
            onOpenSupport={() => setIsSupportOpen(true)}
            onViewQuarantine={() => setCurrentView('QUARANTINE')}
          />
        ) : currentView === 'QUARANTINE' ? (
          /* VIEW: RUANG KARANTINA BERLAPIS */
          <QuarantineView
            quarantinedStories={quarantinedStories}
            onBack={() => setCurrentView('FEED')}
            onDeleteStory={handleDeleteStory}
          />
        ) : (
          /* VIEW: FEED (EXACTLY MATCHING THE USER'S SCREENSHOTS) */
          <>
            {/* 1. Hero Section */}
            <HeroSection
              onStartWriting={() => setCurrentView('WRITE')}
              onScrollToStories={scrollToStories}
            />

            {/* 2. Lima Rasa 5-Card Grid */}
            <LimaRasaCards
              selectedRasa={selectedRasaFilter !== 'ALL' ? selectedRasaFilter : 'GUNJING'}
              onSelectRasa={(rasa) => {
                setSelectedRasaFilter(rasa);
                setOnlySavedFilter(false);
                audioEngine.play(rasa);
                scrollToStories();
              }}
            />

            {/* 3. Filter Rasa & Stories List */}
            <section ref={storiesSectionRef} className="py-12 max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
              <FilterRasaBar
                selectedRasa={selectedRasaFilter}
                onSelectFilter={(rasa) => {
                  setSelectedRasaFilter(rasa);
                  setOnlySavedFilter(false);
                  if (rasa !== 'ALL') audioEngine.play(rasa);
                }}
                onOpenSaved={() => setOnlySavedFilter(!onlySavedFilter)}
                savedCount={savedCount}
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
                    Belum ada cerita dengan rasa ini. Kamu bisa menjadi yang pertama menaruh cerita.
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
