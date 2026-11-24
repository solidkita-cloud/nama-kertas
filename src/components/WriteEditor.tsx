import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Save, Heart, ShieldAlert, X, FileEdit } from 'lucide-react';
import {
  type Story,
  type Rasa,
  type StoryVisibility,
  type User as UserType,
  type QuarantineDetails,
  RASA_DETAILS,
} from '../types';
import { inspectContent, type ModerationResult } from '../utils/contentModeration';

interface WriteEditorProps {
  currentUser: UserType;
  onPublishStory: (data: {
    id?: string;
    title: string;
    content: string;
    rasa: Rasa;
    visibility: StoryVisibility;
    allowReplies: boolean;
    quarantineDetails?: QuarantineDetails;
  }) => void;
  onBack: () => void;
  onOpenSupport: () => void;
  onViewQuarantine: () => void;
  draftToEdit?: Story | null;
  availableDrafts?: Story[];
  onSelectDraft?: (draft: Story) => void;
}

export const WriteEditor: React.FC<WriteEditorProps> = ({
  currentUser,
  onPublishStory,
  onBack,
  onOpenSupport,
  onViewQuarantine,
  draftToEdit,
  availableDrafts = [],
  onSelectDraft,
}) => {
  const [editingDraftId, setEditingDraftId] = useState<string | undefined>(draftToEdit?.id);
  const [title, setTitle] = useState(draftToEdit?.title || '');
  const [content, setContent] = useState(draftToEdit?.content || '');
  const [selectedRasa, setSelectedRasa] = useState<Rasa>(draftToEdit?.rasa || 'GUNJING');
  const [visibility, setVisibility] = useState<StoryVisibility>(
    draftToEdit?.visibility === 'DRAFT' ? 'PUBLIC' : draftToEdit?.visibility || 'PUBLIC'
  );
  const [allowReplies, setAllowReplies] = useState(draftToEdit ? draftToEdit.allowReplies : true);

  // Quarantine interception modal
  const [quarantineModal, setQuarantineModal] = useState<ModerationResult | null>(null);

  useEffect(() => {
    if (draftToEdit) {
      setEditingDraftId(draftToEdit.id);
      setTitle(draftToEdit.title || '');
      setContent(draftToEdit.content || '');
      setSelectedRasa(draftToEdit.rasa || 'GUNJING');
      setAllowReplies(draftToEdit.allowReplies !== false);
    }
  }, [draftToEdit]);

  const isCrisisTriggered = () => {
    const lower = (content + ' ' + title).toLowerCase();
    const keywords = ['bunuh diri', 'ingin mati', 'akhiri hidup', 'menyakiti diri', 'suicide', 'self harm'];
    return keywords.some((k) => lower.includes(k));
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Tulis dulu ceritamu sebelum ditaruh di kertas.');
      return;
    }

    // LAYERED CONTENT MODERATION CHECK (SARA, Porno, Kata Kotor, Judol, Ujaran Kebencian, Doxxing)
    const modResult = inspectContent(title, content);

    if (modResult.isQuarantined) {
      // Trigger Quarantine Modal & block publishing or saving toxic content
      setQuarantineModal(modResult);
      return;
    }

    onPublishStory({
      id: editingDraftId,
      title: title.trim(),
      content: content.trim(),
      rasa: selectedRasa,
      visibility: isDraft ? 'DRAFT' : visibility,
      allowReplies,
    });
  };

  const handleConfirmQuarantine = () => {
    if (!quarantineModal) return;

    onPublishStory({
      id: editingDraftId,
      title: title.trim(),
      content: content.trim(),
      rasa: selectedRasa,
      visibility: 'QUARANTINED',
      allowReplies: false,
      quarantineDetails: {
        category: quarantineModal.category || 'TERLARANG',
        categoryLabel: quarantineModal.categoryLabel || 'Konten Terlarang',
        reason: quarantineModal.reasonText,
        matchedWords: quarantineModal.matchedKeywords,
        quarantinedAt: new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      },
    });

    setQuarantineModal(null);
    onViewQuarantine();
  };

  const rasaList: Rasa[] = ['KALUT', 'GUNJING', 'HARDIK', 'RINDU', 'TENANG'];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-6 animate-in fade-in">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCD5C3] bg-white text-xs font-medium text-[#413D38] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        {currentUser.isAdmin && (
          <button
            onClick={onViewQuarantine}
            className="flex items-center gap-1.5 text-xs text-[#7A746A] hover:text-[#172132] transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Lihat Karantina (Admin)</span>
          </button>
        )}
      </div>

      {/* Editor Sheet */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[#E8E2D2] bg-white shadow-xs space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A746A] font-sans font-medium mb-1">
            <span>—</span>
            <span>TULIS AJA</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#172132]">
            Menulis di Kertas
          </h2>
          <p className="text-xs sm:text-sm text-[#524E48] mt-1">
            Tulis senulisnya aja. Nggak perlu EYD, nggak perlu MD DM. Tulisanmu tidak sedang ujian.
          </p>
        </div>

        {/* Banner Sedang Mengedit Draf */}
        {editingDraftId && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Sedang mengedit draf: <strong>"{title || 'Tanpa Judul'}"</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingDraftId(undefined);
                setTitle('');
                setContent('');
              }}
              className="text-[11px] underline text-amber-900 hover:text-black cursor-pointer shrink-0"
            >
              Mulai baru (kosongkan)
            </button>
          </div>
        )}

        {/* Banner Draf Tersimpan Lainnya */}
        {!editingDraftId && availableDrafts.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-200 text-xs text-[#524E48] space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <FileEdit className="w-4 h-4 text-amber-700" />
              <span>Ada {availableDrafts.length} draf tersimpan di perangkat ini. Klik untuk melanjutkan:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {availableDrafts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDraft?.(d)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-xs text-[#172132] hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
                >
                  <span className="font-medium">{d.title || 'Tanpa Judul'}</span>
                  <span className="text-[10px] text-[#7A746A]">({RASA_DETAILS[d.rasa].label})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gentle Crisis Alert */}
        {isCrisisTriggered() && (
          <div className="p-5 rounded-2xl border border-red-200 bg-[#FFF5F5] text-xs text-red-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <Heart className="w-4 h-4 fill-current text-red-600" />
              <span>Ruang ini mendengarmu, tapi kamu tidak harus memikul semuanya sendirian.</span>
            </div>
            <p className="opacity-90 leading-relaxed">
              Bila beban di hatimu terlalu berat atau kamu membutuhkan teman bicara saat ini juga, ada bantuan gratis yang siap mendengarkan tanpa menghakimi.
            </p>
            <button
              type="button"
              onClick={onOpenSupport}
              className="underline font-semibold cursor-pointer hover:opacity-80"
            >
              Lihat kontak layanan kesehatan jiwa (SEJIWA 119 ext 8) →
            </button>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A746A] mb-1.5">
              Judul Cerita (Opsional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Boleh dikosongkan..."
              className="w-full px-4 py-3 rounded-xl border border-[#DCD5C3] font-serif text-lg font-bold text-[#172132] outline-none focus:border-[#172132] transition-colors bg-[#FDFCFA]"
            />
          </div>

          {/* 5 Rasa Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A746A] mb-2">
              Pilih 1 Rasa yang Mewakili Suasana Batinmu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {rasaList.map((key) => {
                const meta = RASA_DETAILS[key];
                const isSelected = selectedRasa === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRasa(key)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#172132] bg-white shadow-xs'
                        : 'border-[#E0D9C8] bg-[#FDFCFA] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#172132]">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: meta.dotColor }}
                      />
                      <span>{meta.label}</span>
                    </div>
                    <div className="text-[10px] text-[#7A746A] mt-1 leading-snug line-clamp-2">
                      {meta.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A746A] mb-1.5">
              Isi Cerita
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis senulisnya aja... Cerita apa pun asal bukan yang terlarang (bebas dari judol, SARA, porno, ujaran kebencian, atau kata kotor). Di sini kamu tidak perlu menjaga citra nama asli."
              rows={12}
              className="w-full p-4 sm:p-5 rounded-2xl border border-[#DCD5C3] font-serif text-base text-[#2B2724] leading-[2] outline-none resize-y focus:border-[#172132] transition-colors bg-[#FDFCFA]"
            />
            <div className="flex items-center justify-between text-xs text-[#7A746A] mt-2 px-1">
              <span>{wordCount} kata • perkiraan {estimatedMinutes} menit baca</span>
              <span>Menulis sebagai: <strong className="text-[#172132]">{currentUser.paperName}</strong></span>
            </div>
          </div>

          {/* Visibility Options */}
          <div className="p-5 rounded-2xl border border-[#E8E2D2] bg-[#FAF7F0] space-y-3 text-xs">
            <div className="font-semibold uppercase tracking-wider text-[#7A746A] text-[10px]">
              Pengaturan Visibilitas
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/60">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'PUBLIC'}
                  onChange={() => setVisibility('PUBLIC')}
                  className="accent-[#172132] mt-0.5"
                />
                <div>
                  <strong className="block text-[#172132]">Publik (18+)</strong>
                  <span className="text-[#7A746A] text-[11px]">Bisa dibaca pengunjung yang telah melewati pemeriksaan usia.</span>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/60">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'MEMBERS_ONLY'}
                  onChange={() => setVisibility('MEMBERS_ONLY')}
                  className="accent-[#172132] mt-0.5"
                />
                <div>
                  <strong className="block text-[#172132]">Khusus Member</strong>
                  <span className="text-[#7A746A] text-[11px]">Hanya bisa dibaca sesama pemilik akun kertas.</span>
                </div>
              </label>
            </div>

            <div className="pt-2 border-t border-[#EBE4D5] flex items-center justify-between">
              <span className="text-[#524E48]">Izinkan pembaca membalas dengan kertas</span>
              <input
                type="checkbox"
                checked={allowReplies}
                onChange={(e) => setAllowReplies(e.target.checked)}
                className="accent-[#172132] w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              title="Simpan draf secara privat di perangkat ini saja agar bisa dilanjutkan nanti"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#DCD5C3] bg-white text-xs font-medium text-[#413D38] hover:bg-[#F2ECE0] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Draf (Lokal)</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#172132] text-white text-xs font-medium hover:bg-[#23314A] cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Taruh di Kertas</span>
            </button>
          </div>
        </form>
      </div>

      {/* QUARANTINE INTERCEPTION MODAL */}
      {quarantineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-2xs animate-in fade-in">
          <div className="max-w-md w-full p-7 rounded-3xl border border-red-200 bg-white text-[#172132] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Tertahan Filter Karantina</span>
              </div>
              <button
                onClick={() => setQuarantineModal(null)}
                className="p-1 hover:bg-[#F2ECE0] rounded-full cursor-pointer"
              >
                <X className="w-4 h-4 text-[#7A746A]" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#524E48] leading-relaxed">
              <p className="font-semibold text-red-950 text-sm">
                Suratmu tidak dapat ditayangkan ke publik karena terdeteksi memuat:
              </p>

              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-900 space-y-1">
                <strong className="block text-xs uppercase tracking-wide">
                  Kategori: {quarantineModal.categoryLabel}
                </strong>
                <p>{quarantineModal.reasonText}</p>
                {quarantineModal.matchedKeywords.length > 0 && (
                  <p className="font-mono text-[11px] text-red-700">
                    Kata/pola terdeteksi: <strong>{quarantineModal.matchedKeywords.join(', ')}</strong>
                  </p>
                )}
              </div>

              <p className="text-[11px] text-[#7A746A] italic">
                Di Nama Kertas, cerita apa pun boleh asal bukan yang terlarang (bebas dari judi online, pornografi, SARA, kata kotor, dan ujaran kebencian).
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setQuarantineModal(null)}
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Kembali & Perbaiki Tulisan
              </button>

              {currentUser.isAdmin && (
                <button
                  onClick={handleConfirmQuarantine}
                  className="w-full py-2 px-3 text-[11px] text-red-700 hover:underline cursor-pointer text-center"
                >
                  [Khusus Admin] Masukkan ke Arsip Karantina
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
