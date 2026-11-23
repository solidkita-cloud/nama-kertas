import React from 'react';

export const BottomPhilosophyCards: React.FC = () => {
  return (
    <section className="py-12 border-t border-[#EBE4D5] mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl border border-[#E8E2D2] bg-white space-y-2 shadow-2xs">
            <h4 className="font-serif text-lg font-bold text-[#172132]">
              Tulis senulisnya aja
            </h4>
            <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
              Nggak perlu EYD, nggak perlu MD DM. Tulisanmu tidak sedang ujian.
            </p>
          </div>

          <div className="p-7 rounded-2xl border border-[#E8E2D2] bg-white space-y-2 shadow-2xs">
            <h4 className="font-serif text-lg font-bold text-[#172132]">
              Musik untuk pembaca
            </h4>
            <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
              Kamu cukup nulis. Biar pembaca yang dengerin tema yang kamu pilih.
            </p>
          </div>

          <div className="p-7 rounded-2xl border border-[#E8E2D2] bg-white space-y-2 shadow-2xs">
            <h4 className="font-serif text-lg font-bold text-[#172132]">
              Nama kertas, bukan nama asli
            </h4>
            <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
              Yang tampil hanya nama samaranmu. Ceritamu yang dikenal, bukan identitasmu.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-[#EBE4D5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A746A] gap-2">
          <div className="font-serif font-bold text-sm text-[#172132]">
            Nama Kertas
          </div>
          <div className="font-serif italic">
            Tulis aja. Biar kertas yang kenal kamu.
          </div>
        </footer>
      </div>
    </section>
  );
};
