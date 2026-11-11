import React from 'react';
import { Send, MessageSquareQuote, AlertTriangle, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-purple-900/30 bg-[#0c0d1c] pt-12 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Teacher Profile Card */}
          <div className="bg-[#121326] border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase">
                <Sparkles className="w-3 h-3 text-purple-400" /> Profil Pendidik
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Cikgu Hafreez
              </h3>
              <p className="text-xs text-purple-300 font-medium">
                Guru Kimia &bull; MRSM Bagan Datuk
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Membantu pelajar menguasai konsep amali dan teori Kimia KSSM SPM menerusi visualisasi makmal maya interaktif.
              </p>
            </div>

            <a
              href="https://t.me/amierulhafreez"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold transition"
            >
              <Send className="w-3.5 h-3.5" />
              Telegram: @AmierulHafreez
            </a>
          </div>

          {/* Feedback Form Card */}
          <div className="bg-[#121326] border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 text-[10px] font-bold uppercase">
                <MessageSquareQuote className="w-3 h-3 text-pink-400" /> Maklum Balas Pelajar & Guru
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Bantu Kami Tambah Baik!
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apa pendapat anda tentang simulasi ini? Ada sebarang ralat atau cadangan eksperimen baharu yang ingin ditambah?
              </p>
            </div>

            <a
              href="https://forms.gle/1CDwrQcxfck95Vb17"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-semibold transition"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              Beri Maklum Balas (Google Form)
            </a>
          </div>

          {/* Official SPM Disclaimer Card */}
          <div className="bg-[#121326] border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Penafian (Disclaimer)
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Rujukan Rasmi SPM
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sila rujuk buku teks Kimia KSSM dan panduan nota guru untuk *double confirm*. Ralat visual masih boleh berlaku dalam simulasi perisian.
              </p>
            </div>

            <div className="text-[11px] font-semibold text-amber-300/80 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
              ✨ Lebih banyak simulasi makmal akan datang!
            </div>
          </div>

        </div>

        {/* Bottom copyright and motto */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Simulasi Kimia Cikgu Hafreez. Hak Cipta Terpelihara.</p>
          <p className="flex items-center gap-1">
            Dibangunkan khas untuk kecemerlangan pelajar SPM Malaysia <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
};
