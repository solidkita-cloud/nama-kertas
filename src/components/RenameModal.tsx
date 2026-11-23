import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveName(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-2xs animate-in fade-in">
      <div className="max-w-md w-full p-7 rounded-2xl border border-[#E8E2D2] bg-white text-[#172132] shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
          <div>
            <h3 className="font-serif text-xl font-bold">Ganti Nama Kertas</h3>
            <p className="text-xs text-[#7A746A] mt-0.5">
              Identitas samaran yang hidup di lembaran kertas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F2ECE0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#7A746A]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A746A] mb-1.5">
              Nama Kertas Kamu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: pena hijau, semauku, penjaga pantai..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C3] font-serif text-sm outline-none focus:border-[#172132] transition-colors bg-[#FAF7F0]"
              autoFocus
            />
            <p className="text-[11px] text-[#8A847A] mt-1.5">
              Nama ini yang akan muncul di semua tulisan dan balasanmu. Bukan nama aslimu.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#DCD5C3] text-xs font-medium text-[#524E48] hover:bg-[#F2ECE0] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#172132] text-white text-xs font-medium hover:bg-[#23314A] disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Nama</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
