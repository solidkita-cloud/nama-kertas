import React, { useState } from 'react';
import type { Story, User as UserType } from '../types';
import { StoryCard } from './StoryCard';

interface MyPaperProfileProps {
  currentUser: UserType;
  onUpdatePaperName: (newName: string) => void;
  onToggleLogin: () => void;
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onToggleSave: (storyId: string, e: React.MouseEvent) => void;
  onDeleteStory?: (storyId: string, e: React.MouseEvent) => void;
}

export const MyPaperProfile: React.FC<MyPaperProfileProps> = ({
  currentUser,
  onUpdatePaperName,
  onToggleLogin,
  stories,
  onSelectStory,
  onToggleSave,
  onDeleteStory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'MY_STORIES' | 'DRAFTS' | 'SAVED'>('MY_STORIES');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newNameInput, setNewNameInput] = useState(currentUser.paperName);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const myPublished = stories.filter(
    (s) => s.authorPaperName === currentUser.paperName && s.visibility !== 'DRAFT'
  );
  const myDrafts = stories.filter(
    (s) => s.authorPaperName === currentUser.paperName && s.visibility === 'DRAFT'
  );
  const mySaved = stories.filter((s) => s.isSaved);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameInput.trim()) return;
    onUpdatePaperName(newNameInput.trim());
    setIsEditingName(false);
    setFeedbackMsg('Nama kertas diperbarui.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      {/* Profile Header Ledger */}
      <div className="pb-6 mb-8 border-b border-current/15 font-serif space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-widest opacity-50 font-mono">
              Lemari Kertas
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-0.5">
              {currentUser.paperName}
            </h2>
          </div>

          <button
            onClick={onToggleLogin}
            className="text-xs hover:underline opacity-60 hover:opacity-100 self-start sm:self-auto cursor-pointer"
          >
            {currentUser.isLoggedIn ? '[ Simulasi Keluar ]' : '[ Masuk Akun ]'}
          </button>
        </div>

        <p className="text-xs italic opacity-70">
          Identitas kedua yang hidup di atas kertas. Nama aslimu tidak pernah dicari tahu dan tidak pernah diungkap.
        </p>

        {/* Edit Paper Name */}
        <div className="pt-2 text-xs">
          {feedbackMsg && <p className="text-emerald-600 font-semibold mb-2">{feedbackMsg}</p>}

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2 max-w-sm pt-1">
              <input
                type="text"
                value={newNameInput}
                onChange={(e) => setNewNameInput(e.target.value)}
                className="flex-1 bg-transparent border-b border-current pb-1 outline-none text-xs"
                placeholder="Nama kertas baru..."
              />
              <button
                type="submit"
                className="px-2.5 py-1 border border-current text-[11px] hover:bg-current hover:text-white cursor-pointer"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="text-[11px] opacity-60 hover:opacity-100 cursor-pointer"
              >
                Batal
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between opacity-60 text-[11px]">
              <span>Diperbarui: {currentUser.paperNameLastChanged}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="hover:underline cursor-pointer"
              >
                Ganti Nama Kertas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-4 text-xs font-serif pb-2 mb-6 border-b border-current/10">
        <button
          onClick={() => setActiveSubTab('MY_STORIES')}
          className={`cursor-pointer pb-1 ${
            activeSubTab === 'MY_STORIES' ? 'border-b border-current font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          Surat Terbit ({myPublished.length})
        </button>

        <button
          onClick={() => setActiveSubTab('DRAFTS')}
          className={`cursor-pointer pb-1 ${
            activeSubTab === 'DRAFTS' ? 'border-b border-current font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          Draf Pribadi ({myDrafts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('SAVED')}
          className={`cursor-pointer pb-1 ${
            activeSubTab === 'SAVED' ? 'border-b border-current font-bold' : 'opacity-60 hover:opacity-100'
          }`}
        >
          Tersimpan ({mySaved.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {activeSubTab === 'MY_STORIES' && (
          myPublished.length === 0 ? (
            <p className="font-serif italic text-xs py-8 text-center opacity-50">
              Belum ada surat yang kamu taruh di kertas.
            </p>
          ) : (
            myPublished.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                currentUser={currentUser}
                onSelect={onSelectStory}
                onToggleSave={onToggleSave}
                onDeleteStory={onDeleteStory}
              />
            ))
          )
        )}

        {activeSubTab === 'DRAFTS' && (
          myDrafts.length === 0 ? (
            <p className="font-serif italic text-xs py-8 text-center opacity-50">
              Tidak ada draf yang sedang tersimpan.
            </p>
          ) : (
            myDrafts.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                currentUser={currentUser}
                onSelect={onSelectStory}
                onToggleSave={onToggleSave}
                onDeleteStory={onDeleteStory}
              />
            ))
          )
        )}

        {activeSubTab === 'SAVED' && (
          mySaved.length === 0 ? (
            <p className="font-serif italic text-xs py-8 text-center opacity-50">
              Belum ada surat yang kamu simpan untuk dibaca kembali.
            </p>
          ) : (
            mySaved.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                currentUser={currentUser}
                onSelect={onSelectStory}
                onToggleSave={onToggleSave}
                onDeleteStory={onDeleteStory}
              />
            ))
          )
        )}
      </div>
    </div>
  );
};
