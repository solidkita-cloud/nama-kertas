import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartWriting: () => void;
  onScrollToStories: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartWriting,
  onScrollToStories,
}) => {
  return (
    <section className="py-12 sm:py-18 border-b border-[#EBE4D5]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Headline with Script & Editorial Serif */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7A746A] font-sans font-medium">
            <span>—</span>
            <span>RUANG UNTUK BERCERITA</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#172132] leading-[1.15] tracking-tight">
            Tulis aja.<br />
            <span className="font-script text-5xl sm:text-6xl lg:text-[78px] font-normal text-[#2C4A63] block -my-2 sm:-my-3 py-1 drop-shadow-2xs">
              Biar kertas
            </span>
            yang kenal kamu.
          </h2>

          <p className="text-base sm:text-lg text-[#524E48] font-sans leading-relaxed max-w-xl">
            Cerita apa pun, asal bukan yang terlarang. Pakai nama kertasmu, bukan nama aslimu. Di sini tidak ada yang mengejar, tidak ada yang berkedip.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={onStartWriting}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#172132] text-white text-xs sm:text-sm font-medium hover:bg-[#23314A] transition-all cursor-pointer shadow-xs hover:shadow-md"
            >
              <span>Mulai menulis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToStories}
              className="px-6 py-3 rounded-full border border-[#DCD5C3] bg-[#FDFCFA] text-[#524E48] text-xs sm:text-sm font-medium hover:bg-[#F4EFE3] transition-colors cursor-pointer"
            >
              Baca dulu, pelan-pelan
            </button>
          </div>

          <div className="pt-4 space-y-1 text-xs text-[#8A847A] leading-relaxed font-sans">
            <p>Tanpa angka like. Tanpa jumlah pengikut. Tanpa notifikasi yang kedip-kedip.</p>
            <p className="italic font-serif">Kosongnya adalah bagian dari desain — jeda napas.</p>
          </div>
        </div>

        {/* Right Column: Quote Card */}
        <div className="lg:col-span-5">
          <div className="p-8 sm:p-10 rounded-3xl border border-[#E8E2D2] bg-white shadow-xs space-y-6 relative overflow-hidden">
            {/* Subtle background script watermark */}
            <div className="absolute -right-4 -bottom-4 font-script text-9xl text-[#172132]/[0.03] pointer-events-none select-none">
              kertas
            </div>

            <div className="text-3xl font-serif text-[#C49A50] font-bold leading-none select-none">
              ””
            </div>

            <blockquote className="font-editorial text-xl sm:text-2xl text-[#2B2724] leading-relaxed italic font-normal">
              “Kadang kita tidak butuh dinilai. Kita hanya butuh didengarkan, tanpa harus menjelaskan semuanya.”
            </blockquote>

            <div className="text-[11px] uppercase tracking-widest text-[#8A847A] font-sans font-medium">
              — SEBUAH KERTAS YANG DITINGGALKAN
            </div>

            <div className="pt-5 border-t border-[#EBE4D5] space-y-1.5">
              <div className="text-[10px] uppercase tracking-widest text-[#7A746A] font-sans font-semibold">
                MALAM INI DI KERTAS
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                Lima rasa sedang ditulis orang. Pilih satu, lalu duduk sebentar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
