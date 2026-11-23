import React from 'react';
import { X, Phone, ExternalLink } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNightMode: boolean;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, isNightMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 transition-opacity">
      <div
        className={`max-w-lg w-full p-6 sm:p-8 border font-serif transition-all ${
          isNightMode
            ? 'bg-[#182233] border-[#233148] text-[#F4EFE6]'
            : 'bg-[#FAF7F0] border-[#E5DEC9] text-[#211F1D]'
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-current/15">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Teman Bicara & Bantuan Krisis</h3>
            <p className="text-xs opacity-60 italic mt-0.5">Kamu tidak harus memikul semuanya sendirian.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed opacity-85 mb-6">
          Di <em>Nama Kertas</em>, rasa <em>Kalut</em> dan <em>Hardik</em> adalah ruang jujur untuk mengenali diri. Namun jika pikiranmu terasa semakin buntu atau membahayakan dirimu sendiri, jangan ragu untuk menghubungi layanan profesional berikut yang siap mendengarkan tanpa menghakimi:
        </p>

        <div className="space-y-3 mb-6 text-xs">
          {/* SEJIWA 119 */}
          <div className="p-3 border border-current/15 flex items-center justify-between">
            <div>
              <strong className="block text-sm">SEJIWA — Kemenkes RI</strong>
              <span className="opacity-70 text-[11px]">Layanan konsultasi kesehatan jiwa gratis 24 jam</span>
            </div>
            <a
              href="tel:119"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-current hover:bg-current hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>119 ext 8</span>
            </a>
          </div>

          {/* LISA Helpline */}
          <div className="p-3 border border-current/15 flex items-center justify-between">
            <div>
              <strong className="block text-sm">LISA Helpline (Love Inside Suicide Awareness)</strong>
              <span className="opacity-70 text-[11px]">Dukungan krisis kesehatan mental 24 jam</span>
            </div>
            <a
              href="tel:08111400512"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-current hover:bg-current hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>0811-1400-512</span>
            </a>
          </div>

          {/* Yayasan Pulih */}
          <div className="p-3 border border-current/15 flex items-center justify-between">
            <div>
              <strong className="block text-sm">Yayasan Pulih</strong>
              <span className="opacity-70 text-[11px]">Konseling trauma & kesehatan mental</span>
            </div>
            <a
              href="https://yayasanpulih.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:underline text-[11px] font-semibold"
            >
              <span>Kunjungi Situs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 border border-current/30 hover:border-current text-xs font-serif opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
          Tutup & Kembali Membaca
        </button>
      </div>
    </div>
  );
};
