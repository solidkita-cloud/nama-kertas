import React from 'react';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onReject: () => void;
  isNightMode?: boolean;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  isOpen,
  onConfirm,
  onReject,
  isNightMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300">
      <div
        className={`max-w-md w-full p-8 rounded-2xl border font-serif transition-all shadow-2xl ${
          isNightMode
            ? 'bg-[#182233] border-[#233148] text-[#F4EFE6]'
            : 'bg-[#FAF7F0] border-[#E2D8C3] text-[#1E1C1A]'
        }`}
      >
        <div className="text-center pb-4 mb-4 border-b border-[#E2D8C3]">
          <span className="text-[11px] tracking-widest uppercase font-mono text-[#8C8270]">
            Nama Kertas • Regulasi Usia 18+
          </span>
          <h3 className="text-xl font-bold mt-1 tracking-tight text-[#172132]">
            Sebelum Melangkah Masuk
          </h3>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-[#4A453E] mb-8 font-sans">
          <p>
            Ruang ini memuat tulisan personal, keresahan batin, monolog emosional, dan pengalaman hidup yang apa adanya. Sesuai regulasi perlindungan ruang digital (PP 17/2025), Nama Kertas dikhususkan bagi pembaca dan penulis berusia 18 tahun ke atas.
          </p>
          <p className="italic text-[#7A7367] text-xs font-serif">
            Kami tidak mengumpulkan scan KTP atau identitas aslimu. Cukup nyatakan usiamu dengan jujur demi menjaga kenyamanan bersama.
          </p>
        </div>

        <div className="flex flex-col gap-3 font-sans">
          {/* Tombol Utama Hitam Pekat & Jelas */}
          <button
            onClick={onConfirm}
            className="w-full py-3.5 px-5 bg-black hover:bg-neutral-800 text-white font-bold text-sm tracking-wide transition-all cursor-pointer rounded-xl border border-black shadow-md active:scale-[0.99] text-center"
          >
            Saya Berusia 18 Tahun ke Atas (Masuk)
          </button>

          <button
            onClick={onReject}
            className="w-full py-2.5 px-4 text-[#7A7367] hover:text-black hover:underline transition-colors cursor-pointer text-center text-xs"
          >
            Saya di bawah 18 tahun (Tinggalkan meja)
          </button>
        </div>
      </div>
    </div>
  );
};

