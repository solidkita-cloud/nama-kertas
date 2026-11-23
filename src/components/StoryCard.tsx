import React from 'react';
import { Clock, ArrowRight, Bookmark, Trash2 } from 'lucide-react';
import { type Story, type User, RASA_DETAILS } from '../types';

interface StoryCardProps {
  story: Story;
  currentUser: User;
  onSelect: (story: Story) => void;
  onToggleSave: (storyId: string, e: React.MouseEvent) => void;
  onDeleteStory?: (storyId: string, e: React.MouseEvent) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  currentUser,
  onSelect,
  onToggleSave,
  onDeleteStory,
}) => {
  const rasaMeta = RASA_DETAILS[story.rasa];
  const isAuthor = story.authorId === currentUser.id || story.authorPaperName === currentUser.paperName;
  const canDelete = isAuthor || Boolean(currentUser.isAdmin);

  return (
    <article
      onClick={() => onSelect(story)}
      className="p-6 sm:p-7 rounded-2xl border border-[#E8E2D2] bg-white hover:border-[#D4CBB8] transition-all cursor-pointer shadow-2xs hover:shadow-sm space-y-4 flex flex-col justify-between"
    >
      <div>
        {/* Top Meta: Rasa Tag & Reading Time */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
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

          <div className="flex items-center gap-2 text-xs text-[#7A746A]">
            <Clock className="w-3.5 h-3.5" />
            <span>{story.readingTimeMinutes} mnt baca</span>

            <button
              onClick={(e) => onToggleSave(story.id, e)}
              title={story.isSaved ? 'Hapus simpanan' : 'Simpan surat'}
              className="p-1 hover:text-[#172132] transition-colors cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${story.isSaved ? 'fill-[#172132] text-[#172132]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#172132] mb-3 leading-snug">
          {story.title || 'Tanpa Judul'}
        </h3>

        {/* Snippet */}
        <p className="text-sm sm:text-base text-[#524E48] font-sans leading-relaxed line-clamp-4">
          {story.content}
        </p>
      </div>

      <div className="pt-4 border-t border-[#F0EBE1] space-y-3">
        {/* Author Pen Name & Music Theme */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8A847A] font-semibold">
              NAMA KERTAS
            </div>
            <div className="font-medium text-[#172132]">{story.authorPaperName}</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-[#8A847A] font-semibold">
              Musik
            </div>
            <div className="font-medium text-[#172132]">{story.musicTheme}</div>
          </div>
        </div>

        {/* Action Link & Delete Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[#172132] flex items-center gap-1 hover:translate-x-1 transition-transform">
            <span>Baca sampai habis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>

          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Yakin ingin menarik surat "${story.title || 'Tanpa Judul'}" ini dari meja dan menghapusnya?`)) {
                  onDeleteStory?.(story.id, e);
                }
              }}
              title={currentUser.isAdmin && !isAuthor ? 'Hapus Cerita (Hak Akses Admin)' : 'Hapus Surat Saya'}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3 text-rose-600" />
              <span>{currentUser.isAdmin && !isAuthor ? 'Hapus (Admin)' : 'Hapus'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
