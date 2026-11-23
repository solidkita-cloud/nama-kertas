import React from 'react';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onReject: () => void;
  isNightMode: boolean;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  isOpen,
  onConfirm,
  onReject,
  isNightMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 transition-opacity">
      <div
        className={`max-w-md w-full p-8 border font-serif transition-all ${
          isNightMode
            ? 'bg-[#182233] border-[#233148] text-[#F4EFE6]'
            : 'bg-[#FAF7F0] border-[#E5DEC9] text-[#211F1D]'
        }`}
      >
        <div className="text-center pb-4 mb-4 border-b border-current/15">
          <span className="text-[10px] tracking-widest uppercase font-mono opacity-60">
            Nama Kertas • Usia 18+
          </span>
          <h3 className="text-xl font-bold mt-1 tracking-tight">
            Sebelum Melangkah Masuk
          </h3>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed opacity-85 mb-8">
          <p>
            Ruang ini memuat tulisan personal, keresahan batin, monolog emosional, dan pengalaman hidup yang apa adanya. Sesuai regulasi perlindungan ruang digital (PP 17/2025), Nama Kertas dikhususkan bagi pembaca dan penulis berusia 18 tahun ke atas.
          </p>
          <p className="italic opacity-70 text-xs">
            Kami tidak mengumpulkan scan KTP atau identitas aslimu. Cukup nyatakan usiamu dengan jujur demi menjaga kenyamanan bersama.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 text-xs font-serif">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 border border-current bg-current text-[#FAF7F0] dark:text-[#182233] font-bold tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
          >
            Saya Berusia 18 Tahun ke Atas (Masuk)
          </button>

          <button
            onClick={onReject}
            className="w-full py-2.5 px-4 opacity-60 hover:opacity-100 hover:underline transition-opacity cursor-pointer text-center"
          >
            Saya di bawah 18 tahun (Tinggalkan meja)
          </button>
        </div>
      </div>
    </div>
  );
};
