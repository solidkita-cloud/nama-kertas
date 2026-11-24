import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Clock, Lock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Music, Trash2 } from 'lucide-react';
import { type Story, type Reply, type User as UserType, RASA_DETAILS } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { ThreadReplies } from './ThreadReplies';

interface StoryReaderProps {
  story: Story;
  replies: Reply[];
  currentUser: UserType;
  onBack: () => void;
  onToggleSave: (storyId: string) => void;
  onAddReply: (storyId: string, parentReplyId: string | null, tier: 1 | 2 | 3, content: string) => void;
  onRequestLogin: () => void;
  onDeleteStory?: (storyId: string) => void;
  prevStory?: Story | null;
  nextStory?: Story | null;
  currentIndex?: number;
  totalStories?: number;
  onNavigateStory?: (story: Story) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  replies,
  currentUser,
  onBack,
  onToggleSave,
  onAddReply,
  onRequestLogin,
  onDeleteStory,
  prevStory,
  nextStory,
  currentIndex = -1,
  totalStories = 0,
  onNavigateStory,
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const rasaMeta = RASA_DETAILS[story.rasa];
  const isAuthor = story.authorId === currentUser.id || story.authorPaperName === currentUser.paperName;
  const canDelete = isAuthor || Boolean(currentUser.isAdmin);

  useEffect(() => {
    audioEngine.play(story.rasa);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [story.id, story.rasa]);

  // Keyboard shortcut: Panah Kiri (←) & Panah Kanan (→) untuk ganti surat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft' && prevStory) {
        onNavigateStory?.(prevStory);
      } else if (e.key === 'ArrowRight' && nextStory) {
        onNavigateStory?.(nextStory);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevStory, nextStory, onNavigateStory]);

  const isRestricted = story.visibility === 'MEMBERS_ONLY' && !currentUser.isLoggedIn;
  const storyIndexBadge =
    currentIndex >= 0 && totalStories > 0 ? `${currentIndex + 1} dari ${totalStories}` : null;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in">
      {/* Navigation / Back Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCD5C3] bg-white text-xs font-medium text-[#413D38] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Quick Prev / Next Switcher in Header */}
        <div className="flex items-center gap-1.5 text-xs text-[#524E48]">
          <button
            disabled={!prevStory}
            onClick={() => prevStory && onNavigateStory?.(prevStory)}
            title={prevStory ? `Goresan Baru: ${prevStory.title || 'Tanpa Judul'}` : 'Goresan paling baru di meja'}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DCD5C3] bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F2ECE0] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-serif">Goresan Baru</span>
          </button>

          {storyIndexBadge && (
            <span className="text-[11px] text-[#8A847A] px-2 font-mono">
              {storyIndexBadge}
            </span>
          )}

          <button
            disabled={!nextStory}
            onClick={() => nextStory && onNavigateStory?.(nextStory)}
            title={nextStory ? `Goresan Lama: ${nextStory.title || 'Tanpa Judul'}` : 'Goresan paling awal di meja'}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DCD5C3] bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F2ECE0] transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline font-serif">Goresan Lama</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {canDelete && (
            <button
              onClick={() => {
                if (window.confirm(`Yakin ingin menarik surat "${story.title || 'Tanpa Judul'}" ini dari meja dan menghapusnya secara permanen?`)) {
                  onDeleteStory?.(story.id);
                  onBack();
                }
              }}
              title={currentUser.isAdmin && !isAuthor ? 'Hapus Cerita (Hak Akses Admin)' : 'Hapus Surat Saya'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-300 bg-rose-50 text-rose-800 text-xs font-medium hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{currentUser.isAdmin && !isAuthor ? 'Hapus (Admin)' : 'Hapus'}</span>
            </button>
          )}

          <button
            onClick={() => onToggleSave(story.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DCD5C3] bg-white text-xs font-medium text-[#413D38] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${story.isSaved ? 'fill-[#172132] text-[#172132]' : ''}`} />
            <span>{story.isSaved ? 'Tersimpan' : 'Simpan Surat'}</span>
          </button>
        </div>
      </div>

      {/* Main Reading Sheet Card */}
      <article className="p-8 sm:p-12 rounded-3xl border border-[#E8E2D2] bg-white shadow-xs space-y-8">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-[#F0EBE1] text-xs">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: rasaMeta.tagBg, color: '#332F2A' }}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: rasaMeta.dotColor }}
            />
            <span>{rasaMeta.label}</span>
          </div>

          <div className="flex items-center gap-4 text-[#7A746A]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{story.readingTimeMinutes} mnt baca</span>
            </span>

            <span className="flex items-center gap-1 font-serif italic">
              <Music className="w-3.5 h-3.5" />
              <span>Tema: {story.musicTheme}</span>
            </span>

            <span>• {story.createdAt}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172132] leading-tight tracking-tight">
          {story.title || 'Tanpa Judul'}
        </h2>

        {/* Content */}
        {isRestricted ? (
          <div className="my-10 p-8 rounded-2xl border border-[#E8E2D2] bg-[#FAF7F0] text-center space-y-3">
            <Lock className="w-5 h-5 mx-auto text-[#7A746A]" />
            <h3 className="font-serif text-lg font-bold text-[#172132]">
              Surat Khusus Sesama Pemilik Kertas
            </h3>
            <p className="text-xs text-[#524E48] max-w-md mx-auto leading-relaxed">
              Penulis memilih menyimpan isi cerita ini hanya bagi sesama anggota yang telah memiliki nama kertas.
            </p>
            <button
              onClick={onRequestLogin}
              className="mt-2 px-5 py-2 rounded-full bg-[#172132] text-white text-xs font-medium cursor-pointer"
            >
              Masuk / Buat Nama Kertas
            </button>
          </div>
        ) : (
          <div className="font-serif text-lg sm:text-xl text-[#2B2724] leading-[2.1] space-y-6 pt-2 text-justify sm:text-left">
            {story.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Author Sign-off */}
        <div className="pt-8 border-t border-[#F0EBE1] flex items-center justify-between text-sm">
          <div className="text-xs text-[#7A746A]">
            <span className="uppercase text-[10px] tracking-wider block font-semibold">DITULIS OLEH</span>
            <span className="font-serif text-base font-bold text-[#172132] italic">
              {story.authorPaperName}
            </span>
          </div>

          <div className="text-xs text-[#7A746A] italic">
            Tulis aja. Biar kertas yang kenal kamu.
          </div>
        </div>
      </article>

      {/* Previous / Next Story Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevStory ? (
          <button
            onClick={() => onNavigateStory?.(prevStory)}
            className="group p-5 rounded-2xl border border-[#E8E2D2] bg-white hover:border-[#172132] hover:shadow-xs transition-all text-left flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs text-[#7A746A] group-hover:text-[#172132] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-serif font-bold text-sm tracking-tight text-[#172132]">Goresan Baru</span>
              <span className="text-[10px] opacity-60">• {RASA_DETAILS[prevStory.rasa].label}</span>
            </div>
            <div className="font-editorial text-base sm:text-lg font-bold text-[#172132] line-clamp-1">
              {prevStory.title || 'Tanpa Judul'}
            </div>
            <div className="text-xs text-[#8A847A] font-sans">
              Oleh {prevStory.authorPaperName}
            </div>
          </button>
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-[#E0D9C8] text-[#9E978C] text-xs font-serif italic flex items-center justify-center text-center bg-white/40">
            Ini goresan paling baru di atas meja
          </div>
        )}

        {nextStory ? (
          <button
            onClick={() => onNavigateStory?.(nextStory)}
            className="group p-5 rounded-2xl border border-[#E8E2D2] bg-white hover:border-[#172132] hover:shadow-xs transition-all text-right flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-[#7A746A] group-hover:text-[#172132] transition-colors">
              <span className="text-[10px] opacity-60">{RASA_DETAILS[nextStory.rasa].label} •</span>
              <span className="font-serif font-bold text-sm tracking-tight text-[#172132]">Goresan Lama</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-editorial text-base sm:text-lg font-bold text-[#172132] line-clamp-1">
              {nextStory.title || 'Tanpa Judul'}
            </div>
            <div className="text-xs text-[#8A847A] font-sans">
              Oleh {nextStory.authorPaperName}
            </div>
          </button>
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-[#E0D9C8] text-[#9E978C] text-xs font-serif italic flex items-center justify-center text-center bg-white/40">
            Sudah membaca sampai goresan paling awal di meja
          </div>
        )}
      </div>

      {/* 3-Tier Replies Section */}
      <section className="p-8 rounded-3xl border border-[#E8E2D2] bg-white shadow-xs">
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="w-full flex items-center justify-between text-sm font-serif font-bold text-[#172132] pb-4 border-b border-[#F0EBE1] cursor-pointer"
        >
          <span>Balasan dengan Kertas ({replies.length})</span>
          <span className="flex items-center gap-1 text-xs font-sans font-normal text-[#7A746A]">
            {showReplies ? 'Tutup balasan' : 'Buka balasan'}
            {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showReplies && (
          <div className="pt-4">
            <ThreadReplies
              storyId={story.id}
              replies={replies}
              currentUser={currentUser}
              onAddReply={onAddReply}
              isNightMode={false}
              allowReplies={story.allowReplies}
            />
          </div>
        )}
      </section>
    </div>
  );
};
