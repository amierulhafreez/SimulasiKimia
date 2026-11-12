import React from 'react';
import { Send, MessageSquareQuote, AlertTriangle, Sparkles, Heart, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] border-t border-black/[0.06] pt-16 pb-14 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top 3 Minimal Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Teacher Profile Card */}
          <div className="bg-white border border-black/[0.06] p-7 rounded-[24px] flex flex-col justify-between space-y-5 apple-bento-shadow">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#0071e3]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Profil Pendidik</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#1d1d1f]">
                Cikgu Hafreez
              </h3>
              <p className="text-[12px] font-semibold text-[#6e6e73]">
                Guru Kimia · MRSM Bagan Datuk
              </p>
              <p className="text-[13px] text-[#424245] leading-relaxed pt-1">
                Membantu pelajar menguasai konsep amali dan teori Kimia KSSM SPM menerusi visualisasi makmal maya interaktif.
              </p>
            </div>

            <a
              href="https://t.me/amierulhafreez"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#0071e3] text-[#1d1d1f] hover:text-white text-[12px] font-semibold transition"
            >
              <span className="inline-flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Telegram: @AmierulHafreez
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </a>
          </div>

          {/* Feedback Form Card */}
          <div className="bg-white border border-black/[0.06] p-7 rounded-[24px] flex flex-col justify-between space-y-5 apple-bento-shadow">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-pink-600">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Maklum Balas</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#1d1d1f]">
                Bantu Kami Tambah Baik
              </h3>
              <p className="text-[13px] text-[#424245] leading-relaxed">
                Apa pendapat anda tentang simulasi ini? Ada sebarang ralat atau cadangan eksperimen baharu yang ingin ditambah?
              </p>
            </div>

            <a
              href="https://forms.gle/1CDwrQcxfck95Vb17"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#1d1d1f] text-[#1d1d1f] hover:text-white text-[12px] font-semibold transition"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                Beri Maklum Balas (Google Form)
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </a>
          </div>

          {/* Official SPM Disclaimer Card */}
          <div className="bg-white border border-black/[0.06] p-7 rounded-[24px] flex flex-col justify-between space-y-5 apple-bento-shadow">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Penafian Rasmi</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#1d1d1f]">
                Rujukan Rasmi SPM
              </h3>
              <p className="text-[13px] text-[#424245] leading-relaxed">
                Sila rujuk buku teks Kimia KSSM dan panduan nota guru untuk semakan rasmi. Ralat visual masih boleh berlaku dalam simulasi perisian.
              </p>
            </div>

            <div className="text-[12px] font-medium text-[#424245] bg-[#f5f5f7] px-4 py-2.5 rounded-2xl">
              ✨ Sentiasa dikemaskini mengikut silibus KSSM terkini
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#6e6e73] font-medium">
          <p>© {new Date().getFullYear()} Simulasi Kimia Cikgu Hafreez · MRSM Bagan Datuk. Hak Cipta Terpelihara.</p>
          <p className="flex items-center gap-1.5">
            Dibangunkan untuk kecemerlangan Kimia SPM Malaysia <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
