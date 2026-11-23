import React, { useState } from 'react';
import { ShieldCheck, Lock, X, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Password default admin (bisa dikustomisasi via env atau diganti kapan saja)
const ADMIN_PASSWORD_DEFAULT = 'kertas2026';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const correctPassword =
      import.meta.env.VITE_ADMIN_PASSWORD || ADMIN_PASSWORD_DEFAULT;

    if (password.trim() === correctPassword) {
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Kata sandi admin salah. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="max-w-sm w-full p-7 rounded-2xl border border-[#DCD5C3] bg-[#FAF7F0] text-[#172132] shadow-2xl font-sans space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
          <div className="flex items-center gap-2 text-[#172132] font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Kunci Kurator (Admin Meja)</span>
          </div>
          <button
            onClick={() => {
              setPassword('');
              setErrorMsg('');
              onClose();
            }}
            className="p-1 hover:bg-[#F2ECE0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#7A746A]" />
          </button>
        </div>

        <div className="text-xs text-[#524E48] leading-relaxed space-y-1">
          <p>
            Hanya pemilik meja dan kurator resmi yang memiliki wewenang untuk menghapus atau memindahkan surat ke karantina.
          </p>
          <p className="text-[11px] text-[#8A847A] italic">
            Password standar: <code className="bg-[#EFE8D8] px-1.5 py-0.5 rounded text-[#172132] font-mono">kertas2026</code>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#666056]">
              Kata Sandi Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A847A]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Masukkan kata sandi..."
                autoFocus
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#DCD5C3] bg-white text-xs text-[#172132] placeholder:text-[#9E978C] focus:outline-none focus:border-[#172132] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A847A] hover:text-[#172132] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 font-medium pt-1 animate-pulse">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide transition-colors cursor-pointer text-center shadow-xs"
            >
              Buka Akses Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setErrorMsg('');
                onClose();
              }}
              className="py-2.5 px-3.5 rounded-xl border border-[#DCD5C3] text-xs font-medium text-[#524E48] hover:bg-[#F2ECE0] transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
