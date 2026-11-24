import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, X, Eye, EyeOff, AlertOctagon } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 detik cooldown

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [curatorId, setCuratorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedCount, setFailedCount] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Cek cooldown lockout saat modal dibuka
  useEffect(() => {
    const storedLockout = sessionStorage.getItem('nama_kertas_admin_lockout');
    if (storedLockout) {
      const remaining = Math.ceil((parseInt(storedLockout, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutRemaining(remaining);
      } else {
        sessionStorage.removeItem('nama_kertas_admin_lockout');
      }
    }
  }, [isOpen]);

  // Timer hitung mundur jika sedang terkunci
  useEffect(() => {
    if (lockoutRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem('nama_kertas_admin_lockout');
          setFailedCount(0);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (lockoutRemaining > 0) {
      return;
    }

    // Kredensial Lapisan Ganda:
    // 1. Identitas Kurator (case-insensitive: "kurator" atau "admin")
    // 2. Kunci Sandi Rahasia
    const validCuratorIds = ['kurator', 'admin', 'penjaga meja'];
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'kertas2026';

    const isIdValid = validCuratorIds.includes(curatorId.trim().toLowerCase());
    const isPasswordValid = password.trim() === validPassword;

    if (isIdValid && isPasswordValid) {
      // Reset state dan berhasil masuk
      setCuratorId('');
      setPassword('');
      setErrorMsg('');
      setFailedCount(0);
      sessionStorage.removeItem('nama_kertas_admin_lockout');
      onSuccess();
      onClose();
    } else {
      const nextCount = failedCount + 1;
      setFailedCount(nextCount);

      if (nextCount >= MAX_FAILED_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        sessionStorage.setItem('nama_kertas_admin_lockout', lockoutTime.toString());
        setLockoutRemaining(60);
        setErrorMsg('Terlalu banyak percobaan salah. Akses ditutup sementara selama 60 detik.');
      } else {
        const sisa = MAX_FAILED_ATTEMPTS - nextCount;
        setErrorMsg(`Kredensial salah. Sisa kesempatan: ${sisa}x sebelum terkunci.`);
      }
    }
  };

  const isLocked = lockoutRemaining > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-sm w-full p-7 rounded-2xl border border-[#2B3545] bg-[#121926] text-[#F3F4F6] shadow-2xl font-sans space-y-5">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#243042]">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Verifikasi Kurator Meja</span>
          </div>
          <button
            onClick={() => {
              setCuratorId('');
              setPassword('');
              setErrorMsg('');
              onClose();
            }}
            className="p-1 hover:bg-[#233148] rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Privasi (Tanpa Bocoran Password) */}
        <div className="text-xs text-gray-300 leading-relaxed space-y-1">
          <p>
            Ruang kendali khusus penanggung jawab ruang. Memerlukan identitas kurator dan kunci enkripsi yang sah.
          </p>
        </div>

        {/* Lockout Banner */}
        {isLocked && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700/60 text-red-200 text-xs flex items-start gap-2.5 animate-pulse">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-100">Akses Terkunci Sementara</p>
              <p className="text-[11px] text-red-300 mt-0.5">
                Silakan tunggu <strong>{lockoutRemaining} detik</strong> sebelum dapat mencoba kembali.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lapisan 1: Identitas Kurator */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">
              Lapisan 1: Identitas Kurator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                disabled={isLocked}
                value={curatorId}
                onChange={(e) => {
                  setCuratorId(e.target.value);
                  if (errorMsg && !isLocked) setErrorMsg('');
                }}
                placeholder="ID / Nama Kurator..."
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#2B3545] bg-[#1A2333] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              />
            </div>
          </div>

          {/* Lapisan 2: Kunci Sandi Rahasia */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">
              Lapisan 2: Kunci Sandi Rahasia
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isLocked}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg && !isLocked) setErrorMsg('');
                }}
                placeholder="Masukkan kata sandi rahasia..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#2B3545] bg-[#1A2333] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {errorMsg && !isLocked && (
              <p className="text-[11px] text-red-400 font-medium pt-1">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isLocked || !curatorId.trim() || !password.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-xs tracking-wide transition-colors cursor-pointer text-center shadow-xs"
            >
              Verifikasi & Buka Akses
            </button>
            <button
              type="button"
              onClick={() => {
                setCuratorId('');
                setPassword('');
                setErrorMsg('');
                onClose();
              }}
              className="py-2.5 px-3.5 rounded-xl border border-[#2B3545] text-xs font-medium text-gray-300 hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
