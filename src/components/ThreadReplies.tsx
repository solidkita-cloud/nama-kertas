import React, { useState } from 'react';
import { CornerDownRight, X, ShieldAlert, AlertTriangle } from 'lucide-react';
import type { Reply, User as UserType } from '../types';
import { inspectContent } from '../utils/contentModeration';

interface ThreadRepliesProps {
  storyId: string;
  replies: Reply[];
  currentUser: UserType;
  onAddReply: (storyId: string, parentReplyId: string | null, tier: 1 | 2 | 3, content: string) => void;
  isNightMode: boolean;
  allowReplies: boolean;
}

export const ThreadReplies: React.FC<ThreadRepliesProps> = ({
  storyId,
  replies,
  currentUser,
  onAddReply,
  isNightMode,
  allowReplies,
}) => {
  const [replyingTo, setReplyingTo] = useState<{ id: string; paperName: string; tier: 1 | 2 } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [replyBlockedError, setReplyBlockedError] = useState<string | null>(null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    if (!currentUser.isLoggedIn) {
      alert('Kamu perlu memiliki akun Nama Kertas untuk membalas surat.');
      return;
    }

    // LAYERED MODERATION CHECK ON REPLIES
    const modResult = inspectContent('', replyContent);
    if (modResult.isQuarantined) {
      setReplyBlockedError(
        `Balasan tertahan di karantina karena terdeteksi memuat ${modResult.categoryLabel} (${modResult.matchedKeywords.join(', ')}). Di Nama Kertas, percakapan harus bebas dari unsur terlarang.`
      );
      return;
    }

    setReplyBlockedError(null);

    if (replyingTo) {
      const nextTier = (replyingTo.tier + 1) as 2 | 3;
      onAddReply(storyId, replyingTo.id, nextTier, replyContent.trim());
    } else {
      onAddReply(storyId, null, 1, replyContent.trim());
    }

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleReport = (replyId: string) => {
    setReportSuccess(replyId);
    setTimeout(() => setReportSuccess(null), 3000);
  };

  const tier1Replies = replies.filter((r) => !r.parentReplyId || r.tier === 1);
  const getChildren = (parentId: string) => replies.filter((r) => r.parentReplyId === parentId);

  return (
    <div className="pt-6 space-y-6">
      {!allowReplies ? (
        <p className="font-serif italic text-xs text-center opacity-60 py-4">
          Penulis memilih menutup balasan untuk menjaga ketenangan surat ini.
        </p>
      ) : (
        <>
          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="space-y-3">
            {replyBlockedError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{replyBlockedError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyBlockedError(null)}
                  className="p-0.5 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {replyingTo && (
              <div className="flex items-center justify-between text-xs font-serif opacity-75 pb-1">
                <span>
                  Membalas kertas: <em>{replyingTo.paperName}</em>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="p-0.5 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div
              className={`p-4 border transition-colors ${
                isNightMode
                  ? 'bg-[#182233] border-[#233148] focus-within:border-[#8DA8C7]'
                  : 'bg-[#FAF7F0] border-[#E5DEC9] focus-within:border-[#3A5169]'
              }`}
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Tulis balasanmu untuk ${replyingTo.paperName}...`
                    : 'Tulis balasan dengan nama kertasmu (santai, jujur, tanpa menghakimi)...'
                }
                rows={3}
                className="w-full bg-transparent resize-none border-none outline-none font-serif text-sm leading-relaxed placeholder:opacity-40"
              />

              <div className="flex items-center justify-between pt-3 border-t border-current/10 text-xs font-serif">
                <span className="opacity-60 text-[11px]">
                  Dari: <em>{currentUser.paperName}</em>
                </span>

                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-3.5 py-1.5 border border-current text-xs font-serif transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-current hover:text-white"
                >
                  Tinggalkan Balasan
                </button>
              </div>
            </div>
          </form>

          {/* List of Replies */}
          {replies.length === 0 ? (
            <p className="font-serif italic text-xs text-center py-6 opacity-50">
              Belum ada balasan. Jadilah kertas pertama yang meninggalkan jejak di sini.
            </p>
          ) : (
            <div className="space-y-5 pt-2">
              {tier1Replies.map((r1) => {
                const tier2Replies = getChildren(r1.id);
                return (
                  <div key={r1.id} className="space-y-3">
                    <ReplyItem
                      reply={r1}
                      onReplyClick={() => setReplyingTo({ id: r1.id, paperName: r1.authorPaperName, tier: 1 })}
                      onReportClick={() => handleReport(r1.id)}
                      isReported={reportSuccess === r1.id}
                      canReply={true}
                    />

                    {tier2Replies.map((r2) => {
                      const tier3Replies = getChildren(r2.id);
                      return (
                        <div key={r2.id} className="pl-4 sm:pl-6 border-l border-current/20 space-y-3 ml-2">
                          <ReplyItem
                            reply={r2}
                            onReplyClick={() => setReplyingTo({ id: r2.id, paperName: r2.authorPaperName, tier: 2 })}
                            onReportClick={() => handleReport(r2.id)}
                            isReported={reportSuccess === r2.id}
                            canReply={true}
                          />

                          {tier3Replies.map((r3) => (
                            <div key={r3.id} className="pl-4 sm:pl-6 border-l border-current/20 ml-2">
                              <ReplyItem
                                reply={r3}
                                onReplyClick={() => {}}
                                onReportClick={() => handleReport(r3.id)}
                                isReported={reportSuccess === r3.id}
                                canReply={false}
                                isDeepest={true}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface ReplyItemProps {
  reply: Reply;
  onReplyClick: () => void;
  onReportClick: () => void;
  isReported: boolean;
  canReply: boolean;
  isDeepest?: boolean;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  onReplyClick,
  onReportClick,
  isReported,
  canReply,
  isDeepest,
}) => {
  return (
    <div className="p-4 border border-current/10 font-serif text-xs space-y-2">
      <div className="flex items-center justify-between text-[11px] opacity-60 pb-1 border-b border-current/10">
        <span className="font-bold">{reply.authorPaperName}</span>
        <span className="font-mono">{reply.createdAt}</span>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">{reply.content}</p>

      <div className="flex items-center justify-between text-[11px] pt-1 opacity-70">
        <div>
          {canReply ? (
            <button
              onClick={onReplyClick}
              className="flex items-center gap-1 hover:underline cursor-pointer"
            >
              <CornerDownRight className="w-2.5 h-2.5" />
              <span>Balas catatan ini</span>
            </button>
          ) : (
            <span className="italic opacity-60">
              {isDeepest ? 'Batas balasan terdalam' : ''}
            </span>
          )}
        </div>

        <button
          onClick={onReportClick}
          title="Laporkan balasan jika melanggar ketentuan"
          className="flex items-center gap-1 hover:underline cursor-pointer opacity-60 hover:opacity-100"
        >
          <ShieldAlert className="w-2.5 h-2.5" />
          <span>{isReported ? 'Tercatat' : 'Lapor'}</span>
        </button>
      </div>
    </div>
  );
};
