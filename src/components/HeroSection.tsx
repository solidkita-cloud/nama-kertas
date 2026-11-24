import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartWriting: () => void;
  onScrollToStories: () => void;
}

interface SituasiQuote {
  situationHeader: string;
  situationSubtext: string;
  quote: string;
  author: string;
}

const SITUASI_QUOTES: SituasiQuote[] = [
  {
    situationHeader: 'MALAM INI DI KERTAS',
    situationSubtext: 'Lima rasa sedang ditulis orang. Pilih satu, lalu duduk sebentar.',
    quote: '“Kadang kita tidak butuh dinilai. Kita hanya butuh didengarkan, tanpa harus menjelaskan semuanya.”',
    author: '— SEBUAH KERTAS YANG DITINGGALKAN',
  },
  {
    situationHeader: 'SAAT HUJAN MEREDA',
    situationSubtext: 'Ada kata-kata yang baru berani keluar ketika dunia di luar mulai sepi.',
    quote: '“Tidak semua yang patah perlu lekas disambung. Kadang ia hanya ingin dibiarkan berbaring, ditemani rintik yang turun perlahan.”',
    author: '— SECANGKIR AIR HANGAT',
  },
  {
    situationHeader: 'JEDA TENGAH HARI',
    situationSubtext: 'Tulis senulisnya aja. Kertas ini tidak pernah menuntutmu sempurna.',
    quote: '“Kita terlalu lelah berpura-pura kuat di hadapan orang banyak. Di atas kertas ini, kamu boleh jadi manusia biasa yang rapuh.”',
    author: '— SUARA DI LANTAI TIGA',
  },
  {
    situationHeader: 'KALA SENJA TIBA',
    situationSubtext: 'Lepaskan beban yang menggelayut di pundak. Biar kertas yang menampungnya.',
    quote: '“Rindu yang paling sunyi adalah rindu pada diri kita sendiri di masa lalu—sebelum semua hal menjadi begitu rumit.”',
    author: '— PENA HIJAU',
  },
  {
    situationHeader: 'DI ANTARA DUA WAKTU',
    situationSubtext: 'Menulislah bukan untuk dinilai orang, tapi agar kepalamu punya ruang lega.',
    quote: '“Ada hal-hal yang tidak selesai dengan dibicarakan, tetapi selesai saat kita berhenti memikirkannya di jam tiga subuh.”',
    author: '— YANG LAGI TERMENUNG',
  },
  {
    situationHeader: 'KERTAS PAGI',
    situationSubtext: 'Tarik napas pelan. Hari ini belum tentu seburuk apa yang kamu takutkan.',
    quote: '“Langit tidak pernah meminta maaf karena mendung. Kamu juga tidak perlu merasa bersalah hanya karena hari ini terasa berat.”',
    author: '— SAKSI YANG DIAM',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartWriting,
  onScrollToStories,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % SITUASI_QUOTES.length);
        setFadeState('in');
      }, 500);
    }, 20000); // Berganti tiap 20 detik

    return () => clearInterval(timer);
  }, []);

  const handleSelectQuote = (idx: number) => {
    if (idx === quoteIndex) return;
    setFadeState('out');
    setTimeout(() => {
      setQuoteIndex(idx);
      setFadeState('in');
    }, 300);
  };

  const current = SITUASI_QUOTES[quoteIndex];

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

        {/* Right Column: Dynamic Rotating Quote Card */}
        <div className="lg:col-span-5">
          <div className="p-8 sm:p-10 rounded-3xl border border-[#E8E2D2] bg-white shadow-xs space-y-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            {/* Subtle background script watermark */}
            <div className="absolute -right-4 -bottom-4 font-script text-9xl text-[#172132]/[0.03] pointer-events-none select-none">
              kertas
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-serif text-[#C49A50] font-bold leading-none select-none">
                ””
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5 z-10" title="Kutipan berganti tiap 20 detik">
                {SITUASI_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuote(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === quoteIndex
                        ? 'w-6 bg-[#C49A50]'
                        : 'w-1.5 bg-[#E8E2D2] hover:bg-[#C49A50]/50'
                    }`}
                    aria-label={`Lihat situasi ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div
              className={`space-y-4 transition-all duration-500 ease-in-out ${
                fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
              }`}
            >
              <blockquote className="font-editorial text-xl sm:text-2xl text-[#2B2724] leading-relaxed italic font-normal">
                {current.quote}
              </blockquote>

              <div className="text-[11px] uppercase tracking-widest text-[#8A847A] font-sans font-medium">
                {current.author}
              </div>
            </div>

            <div
              className={`pt-5 border-t border-[#EBE4D5] space-y-1.5 transition-all duration-500 ease-in-out ${
                fadeState === 'in' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#7A746A] font-sans font-semibold">
                <span>{current.situationHeader}</span>
                <span className="text-[9px] text-[#A39C90] font-normal lowercase">ganti tiap 20dtk</span>
              </div>
              <p className="text-xs text-[#524E48] leading-relaxed">
                {current.situationSubtext}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
