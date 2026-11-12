import { SimulationItem } from '../types/simulation';

export const SIMULATIONS_DATA: SimulationItem[] = [
  // ================= TINGKATAN 4 (DISUSUN MENGIKUT TOPIK BAB 2–7) =================
  // --- Bab 2: Jirim dan Struktur Atom ---
  {
    id: 'keadaan-zarah-jirim',
    title: 'Keadaan Zarah: Perubahan Keadaan Jirim',
    form: 'Tingkatan 4',
    chapter: 'Bab 2: Jirim dan Struktur Atom',
    category: 'Jirim & Struktur Atom',
    description: 'Kawal suhu 8 bahan (Air, Naftalena, CO₂, O₂, He, Na, NaCl, CuSO₄) untuk melihat perubahan zarah semasa pemanasan & penyejukkan serta takat lebur, beku & didih.',
    learningStandard: 'SP 2.1.1 - Menghuraikan perubahan keadaan fizikal jirim berdasarkan teori kinetik jirim',
    iconName: 'Boxes',
    colorTheme: 'cyan',
    isImplemented: true,
    tags: ['Slider Suhu', '8 Bahan', 'Takat Lebur/Beku/Didih', 'Pemanasan & Penyejukkan']
  },
  {
    id: 'pemanasan-dan-penyejukkan-naftalena',
    title: 'Pemanasan & Penyejukan Naftalena',
    form: 'Tingkatan 4',
    chapter: 'Bab 2: Jirim dan Struktur Atom',
    category: 'Jirim & Struktur Atom',
    description: 'Simulasi Aktiviti 2.2 (Rajah 2.4–2.7): perhatikan kukus air, kelalang kon, gerakan zarah pepejal/cecair serta lengkung pemanasan & penyejukan naftalena (80.0 °C).',
    learningStandard: 'SP 2.1.3 - Menentukan takat lebur dan takat beku naftalena melalui eksperimen',
    iconName: 'Thermometer',
    colorTheme: 'rose',
    isImplemented: true,
    tags: ['Kukus Air', 'Kelalang Kon', 'Takat Lebur 80°C', 'Zarah Kinetik']
  },

  // --- Bab 3: Konsep Mol, Formula dan Persamaan Kimia ---
  {
    id: 'penghasilan-formula-kimia',
    title: 'Penghasilan Formula Kimia Sebatian Ion',
    form: 'Tingkatan 4',
    chapter: 'Bab 3: Konsep Mol, Formula dan Persamaan Kimia',
    category: 'Jirim & Struktur Atom',
    description: 'Seret dan lepas semua 12 kation dan 12 anion (Jadual 3.7 KSSM) untuk membina formula kimia sebatian ion berserta kaedah silang, kad ion dan penerangan.',
    learningStandard: 'SP 3.3.5 - Membina formula kimia sebatian',
    iconName: 'Binary',
    colorTheme: 'emerald',
    isImplemented: true,
    tags: ['Formula Kimia', 'Kation & Anion', 'Kaedah Silang', 'Aktiviti 3.15']
  },
  {
    id: 'penyeimbangan-persamaan-kimia',
    title: 'Seimbang Persamaan Kimia',
    form: 'Tingkatan 4',
    chapter: 'Bab 3: Konsep Mol, Formula dan Persamaan Kimia',
    category: 'Jirim & Struktur Atom',
    description: 'Seimbangkan 7 persamaan kimia buku teks mengikut aras kesukaran meningkat dengan menaip atau klik pekali, serta jana analisis kualitatif dan kuantitatif (SP 3.4.2).',
    learningStandard: 'SP 3.4.1 & 3.4.2 - Mengimbangkan persamaan kimia dan mentafsirkannya secara kualitatif & kuantitatif',
    iconName: 'Scale',
    colorTheme: 'amber',
    isImplemented: true,
    tags: ['7 Persamaan KSSM', 'Stoikiometri', 'Analisis Kualitatif', 'Analisis Kuantitatif']
  },

  // --- Bab 4: Jadual Berkala Unsur ---
  {
    id: 'kereaktifan-k1-dan-k17',
    title: 'Kereaktifan Kumpulan 1 & Kumpulan 17',
    form: 'Tingkatan 4',
    chapter: 'Bab 4: Jadual Berkala Unsur',
    category: 'Jadual Berkala',
    description: 'Bandingkan siri kad unsur Kumpulan 1 (Li–Cs) dan Kumpulan 17 (F₂–I₂) dari segi sifat fizik, sifat kimia serta persamaan kimia tindak balas.',
    learningStandard: 'SP 4.4.1–4.4.3 & SP 4.5.1–4.5.3 - Sifat fizik, sifat kimia dan kereaktifan Kumpulan 1 & 17',
    iconName: 'Zap',
    colorTheme: 'orange',
    isImplemented: true,
    tags: ['Kumpulan 1', 'Kumpulan 17', 'Sifat Fizik', 'Persamaan Kimia']
  },

  // --- Bab 5: Ikatan Kimia ---
  {
    id: 'penghasilan-sebatian-kovalen',
    title: 'Penghasilan Sebatian Ion & Sebatian Kovalen',
    form: 'Tingkatan 4',
    chapter: 'Bab 5: Ikatan Kimia',
    category: 'Ikatan Kimia',
    description: 'Pilih dan seret unsur logam serta bukan logam untuk membina sebatian ion atau sebatian kovalen lengkap dengan rajah pemindahan/perkongsian elektron dan sifat fizik.',
    learningStandard: 'SP 5.2.1, 5.3.1 & 5.7.1 - Pembentukan & sifat sebatian ion dan kovalen',
    iconName: 'Atom',
    colorTheme: 'indigo',
    isImplemented: true,
    tags: ['Pick & Drop', 'Ikatan Ion', 'Ikatan Kovalen', 'Sifat Fizik']
  },
  {
    id: 'daya-tarikan-zarah',
    title: 'Penerangan Daya Tarikan Antara Zarah (Tug of War)',
    form: 'Tingkatan 4',
    chapter: 'Bab 4 & Bab 5: Jadual Berkala dan Ikatan Kimia',
    category: 'Ikatan Kimia',
    description: 'Mekanik Tug of War interaktif yang membandingkan Daya Tarikan Antara Zarah (Van der Waals), Tarikan Nukleus–Elektron Valens, Daya Tarikan Elektrostatik dan Ikatan Hidrogen berserta duel 1v1.',
    learningStandard: 'SP 4.4.3, 4.5.3, 5.2.1, 5.4.1–5.4.2, 5.6.1 & 5.7.1 - Membandingkan daya tarikan dalam silibus KSSM',
    iconName: 'Magnet',
    colorTheme: 'sky',
    isImplemented: true,
    tags: ['Tug of War', 'Van der Waals', 'Nukleus & Elektron', 'Elektrostatik', 'Ikatan Hidrogen']
  },

  // --- Bab 6: Asid, Bes dan Garam ---
  {
    id: 'penyediaan-larutan-piawai',
    title: 'Penyediaan & Pencairan Larutan Piawai',
    form: 'Tingkatan 4',
    chapter: 'Bab 6: Asid, Bes dan Garam',
    category: 'Asid, Bes & Garam',
    description: 'Sediakan larutan piawai 1.0 M bagi NaCl, CuSO₄ dan FeCl₃ daripada bahan pepejal menggunakan seret dan lepas (Aktiviti 6.7) serta lakukan pencairan kepada 0.5 M lengkap dengan pengiraan isi padu air diperlukan (Aktiviti 6.8).',
    learningStandard: 'SP 6.6.1–6.6.3 - Menyediakan larutan piawai daripada bahan pepejal dan kaedah pencairan (M₁V₁ = M₂V₂)',
    iconName: 'Beaker',
    colorTheme: 'blue',
    isImplemented: true,
    tags: ['NaCl, CuSO₄ & FeCl₃', 'Seret & Lepas', '1.0 M → 0.5 M', 'M₁V₁ = M₂V₂']
  },
  {
    id: 'pentitratan-asid-alkali',
    title: 'Pentitratan Asid Alkali',
    form: 'Tingkatan 4',
    chapter: 'Bab 6: Asid, Bes dan Garam',
    category: 'Asid, Bes & Garam',
    description: 'Titrat asid nitrik HNO₃ 1.0 mol dm⁻³ ke dalam 25.0 cm³ larutan KOH 1.0 mol dm⁻³ (Rajah 6.32) dengan pilihan penunjuk fenolftalein atau metil jingga.',
    learningStandard: 'SP 6.7.2 & 6.7.3 - Menentukan isi padu takat akhir pentitratan & kepekatan larutan melalui kaedah peneutralan',
    iconName: 'FlaskConical',
    colorTheme: 'purple',
    isImplemented: true,
    tags: ['Buret', 'Takat Akhir', 'Fenolftalein', 'Metil Jingga', 'Jubin Putih']
  },
  {
    id: 'keterlarutan-garam',
    title: 'Keterlarutan Garam Dalam Air',
    form: 'Tingkatan 4',
    chapter: 'Bab 6: Asid, Bes dan Garam',
    category: 'Asid, Bes & Garam',
    description: 'Bina garam daripada kation dan anion, seret sampel pepejal ke dalam bikar air (Eksperimen 6.5) serta perhati keterlarutan dan warna pepejal lawan larutan akueus.',
    learningStandard: 'SP 6.9.1 & 6.11.1 - Mengelaskan garam terlarutkan/tak terlarutkan serta warna pepejal dan akueus',
    iconName: 'Droplets',
    colorTheme: 'teal',
    isImplemented: true,
    tags: ['Drag & Drop', 'NO ANaK / PBC / HPA', 'Warna Garam', 'Air Panas PbCl₂ & PbI₂']
  },
  {
    id: 'ujian-gas',
    title: 'Ujian Pengesahan Gas Makmal',
    form: 'Tingkatan 4',
    chapter: 'Bab 6: Asid, Bes dan Garam',
    category: 'Asid, Bes & Garam',
    description: 'Uji dan kenal pasti kesemua 8 gas buku teks (O₂, H₂, CO₂, NH₃, Cl₂, HCl, SO₂, NO₂) menggunakan makmal maya seret dan lepas (drag & drop).',
    learningStandard: 'SP 6.10.1 - Memerihalkan ujian untuk mengenal pasti gas (Aktiviti 6.26)',
    iconName: 'Flame',
    colorTheme: 'cyan',
    isImplemented: true,
    tags: ['8 Gas KSSM', 'Drag & Drop', 'Air Kapur', 'Litmus', 'KMnO₄']
  },
  {
    id: 'ujian-kation',
    title: 'Analisis Kualitatif: Ujian Kation',
    form: 'Tingkatan 4',
    chapter: 'Bab 6: Asid, Bes dan Garam',
    category: 'Asid, Bes & Garam',
    description: 'Kenal pasti larutan misteri melalui makmal maya gamifikasi: uji dengan NaOH, NH₃, KI, Reagen Nessler, K₃Fe(CN)₆, K₄Fe(CN)₆ dan KSCN serta cuci tabung uji untuk ujian berulang.',
    learningStandard: 'SP 6.11.1 & 6.11.2 - Mengenal pasti dan mengesahkan kation dalam larutan akueus',
    iconName: 'TestTube',
    colorTheme: 'violet',
    isImplemented: true,
    tags: ['Gamifikasi', 'Makmal Maya', 'NaOH & NH₃', 'Ujian Pengesahan']
  },
  {
    id: 'ujian-anion',
    title: 'Analisis Kualitatif: Ujian Anion',
    form: 'Tingkatan 4',
    chapter: 'Bab 6: Asid, Bes dan Garam',
    category: 'Asid, Bes & Garam',
    description: 'Kenal pasti pepejal garam misteri (CO₃²⁻, Cl⁻, SO₄²⁻, NO₃⁻) melalui pemanasan pepejal (Rajah 6.46–6.47) dan ujian reagen anion (Eksperimen 6.9) lengkap dengan ciri cuci tabung uji.',
    learningStandard: 'SP 6.10.2 & 6.11.1 - Mengkaji tindakan haba ke atas garam dan mengenal pasti anion',
    iconName: 'Layers',
    colorTheme: 'fuchsia',
    isImplemented: true,
    tags: ['Gamifikasi', 'Pemanasan Garam', 'Cincin Perang', 'Ujian Anion KSSM']
  },

  // --- Bab 7: Kadar Tindak Balas ---
  {
    id: 'kadar-tindak-balas-saiz',
    title: 'Kadar Tindak Balas: Faktor Saiz Bahan',
    form: 'Tingkatan 4',
    chapter: 'Bab 7: Kadar Tindak Balas',
    category: 'Kadar Tindak Balas',
    description: 'Bandingkan tindak balas ketulan besar vs ketulan kecil kalsium karbonat (CaCO₃) dengan asid hidroklorik cair menggunakan buret sesaran air (Rajah 7.12) dan graf lengkung masa nyata setiap 30 saat.',
    learningStandard: 'SP 7.2.1 - Mengkaji kesan saiz bahan tindak balas terhadap kadar tindak balas',
    iconName: 'Timer',
    colorTheme: 'amber',
    isImplemented: true,
    tags: ['CaCO₃ + HCl', 'Sesaran Air Buret', 'Graf Masa Nyata', 'Tangen & Luas Permukaan']
  },
  {
    id: 'kadar-tindak-balas-kepekatan',
    title: 'Kadar Tindak Balas: Faktor Kepekatan',
    form: 'Tingkatan 4',
    chapter: 'Bab 7: Kadar Tindak Balas',
    category: 'Kadar Tindak Balas',
    description: 'Kaji tindak balas natrium tiosulfat (Na₂S₂O₃) dengan asid sulfurik (H₂SO₄) menggunakan kaedah tanda \'✕\' (Eksperimen 7.2, Rajah 7.14) lengkap dengan lengkung kekeruhan masa nyata dan graf 1/masa melawan kepekatan.',
    learningStandard: 'SP 7.2.1 - Mengkaji kesan kepekatan bahan tindak balas terhadap kadar tindak balas',
    iconName: 'Timer',
    colorTheme: 'amber',
    isImplemented: true,
    tags: ['Na₂S₂O₃ + H₂SO₄', 'Tanda ✕ Sulfur', 'Graf 1/Masa vs M₂', 'M₁V₁ = M₂V₂']
  },
  {
    id: 'kadar-tindak-balas-suhu',
    title: 'Kadar Tindak Balas: Faktor Suhu',
    form: 'Tingkatan 4',
    chapter: 'Bab 7: Kadar Tindak Balas',
    category: 'Kadar Tindak Balas',
    description: 'Kaji kesan suhu larutan natrium tiosulfat (30 °C hingga 55 °C) terhadap kadar tindak balas menggunakan pemanasan tungku kaki tiga & tanda \'✕\' (Eksperimen 7.3) lengkap dengan graf masa nyata.',
    learningStandard: 'SP 7.2.1 - Mengkaji kesan suhu terhadap kadar tindak balas dan tenaga pengaktifan',
    iconName: 'Timer',
    colorTheme: 'amber',
    isImplemented: true,
    tags: ['Na₂S₂O₃ + H₂SO₄', 'Suhu 30–55 °C', 'Pemanasan & Tanda ✕', 'Graf 1/Masa vs Suhu']
  },
  {
    id: 'kadar-tindak-balas-mangkin',
    title: 'Kadar Tindak Balas: Faktor Mangkin',
    form: 'Tingkatan 4',
    chapter: 'Bab 7: Kadar Tindak Balas',
    category: 'Kadar Tindak Balas',
    description: 'Bandingkan penguraian hidrogen peroksida (H₂O₂) tanpa mangkin dan dengan mangkin MnO₂, Fe serta CuO (Eksperimen 7.4 & Jadual 7.8) lengkap dengan graf masa nyata dan rajah profil tenaga satu paksi (Rajah 7.26).',
    learningStandard: 'SP 7.2.1 - Mengkaji kesan kehadiran mangkin terhadap kadar tindak balas dan tenaga pengaktifan',
    iconName: 'Timer',
    colorTheme: 'amber',
    isImplemented: true,
    tags: ['H₂O₂ + MnO₂', 'Ujian Kayu Uji', 'Graf O₂ vs Masa', 'Profil Tenaga Eₐ']
  },

  // ================= TINGKATAN 5 (DISUSUN MENGIKUT TOPIK BAB 1–5) =================
  // --- Bab 1: Keseimbangan Redoks ---
  {
    id: 'elektrolisis',
    title: 'Elektrolisis Leburan & Larutan Akueus',
    form: 'Tingkatan 5',
    chapter: 'Bab 1: Keseimbangan Redoks',
    category: 'Elektrokimia',
    description: 'Kaji pemilihan ion untuk dinyahcas pada anod dan katod berdasarkan nilai E⁰ (keupayaan elektrod piawai), kepekatan dan jenis elektrod.',
    learningStandard: 'SP 1.4.2 - Membandingkan elektrolisis sebatian lebur dan larutan akueus',
    iconName: 'BatteryCharging',
    colorTheme: 'blue',
    isImplemented: true,
    tags: ['Anod', 'Katod', 'Siri Elektrokimia', 'E⁰ Piawai']
  },
  {
    id: 'pengekstrakan-aluminium',
    title: 'Pengekstrakan Aluminium daripada Bauksit',
    form: 'Tingkatan 5',
    chapter: 'Bab 1: Keseimbangan Redoks',
    category: 'Elektrokimia',
    description: 'Sel elektrolisis leburan alumina dan kriolit (Rajah 1.37): perhatikan pergerakan ion Al³⁺ & O²⁻, peranan kriolit (950 °C), hakisan anod karbon (CO₂) dan penjimatan tenaga kitar semula 95%.',
    learningStandard: 'SP 1.5.1 - Menerangkan pengekstrakan logam reaktif (aluminium) melalui elektrolisis',
    iconName: 'Zap',
    colorTheme: 'indigo',
    isImplemented: true,
    tags: ['Bauksit (Al₂O₃)', 'Kriolit (Na₃AlF₆)', 'Anod Karbon', 'Kitar Semula 95%']
  },
  {
    id: 'pengekstrakan-besi',
    title: 'Pengekstrakan Besi daripada Bijihnya',
    form: 'Tingkatan 5',
    chapter: 'Bab 1: Keseimbangan Redoks',
    category: 'Elektrokimia',
    description: 'Simulasi interaktif Relau Bagas (Rajah 1.38): pelajari 3 zon suhu, tindak balas penurunan hematit (Fe₂O₃) oleh karbon monoksida dan pembentukan sanga daripada batu kapur.',
    learningStandard: 'SP 1.5.2 - Menerangkan pengekstrakan logam daripada bijihnya menggunakan karbon dalam relau bagas',
    iconName: 'Factory',
    colorTheme: 'orange',
    isImplemented: true,
    tags: ['Hematit (Fe₂O₃)', 'Relau Bagas', 'Arang Kok', 'Batu Kapur', 'Sanga']
  },

  // --- Bab 2: Sebatian Karbon ---
  {
    id: 'formula-struktur-karbon',
    title: 'Melukis Formula Struktur Sebatian Karbon',
    form: 'Tingkatan 5',
    chapter: 'Bab 2: Sebatian Karbon',
    category: 'Kimia Karbon',
    description: 'Papan lukisan molekul karbon: bina rantai alkana, alkena, alkuna, alkohol, asid karboksilik dan ester.',
    learningStandard: 'SP 2.1.2 - Melukis formula struktur hidrokarbon',
    iconName: 'Share2',
    colorTheme: 'indigo',
    isImplemented: true,
    tags: ['Kumpulan Berfungsi', 'Ester', 'Alkohol', 'Formula Molekul']
  },
  {
    id: 'penentuan-isomer',
    title: 'Penentuan & Melukis Isomer Alkana/Alkena',
    form: 'Tingkatan 5',
    chapter: 'Bab 2: Sebatian Karbon',
    category: 'Kimia Karbon',
    description: 'Terokai keisomeran rantai dan kedudukan bagi butana, butena dan alkohol. Uji nama IUPAC secara interaktif.',
    learningStandard: 'SP 2.4.1 - Membina dan menamakan isomer mengikut IUPAC',
    iconName: 'Network',
    colorTheme: 'purple',
    isImplemented: true,
    tags: ['Isomer Rantai', 'Isomer Kedudukan', 'Penamaan IUPAC']
  },

  // --- Bab 3: Termokimia ---
  {
    id: 'haba-penyesaran',
    title: 'Termokimia: Haba Penyesaran Logam',
    form: 'Tingkatan 5',
    chapter: 'Bab 3: Termokimia',
    category: 'Termokimia',
    description: 'Ukur kenaikan suhu apabila serbuk zink berlebihan dimasukkan ke dalam larutan kuprum(II) sulfat dan hitung nilai ΔH penyesaran.',
    learningStandard: 'SP 3.1.2 - Menentukan haba penyesaran melalui eksperimen',
    iconName: 'FlameKindling',
    colorTheme: 'red',
    isImplemented: true,
    tags: ['ΔH Penyesaran', 'Cawan Polistirena', 'Kenaikan Suhu', 'Eksotermik']
  },
  {
    id: 'haba-pembakaran',
    title: 'Termokimia: Haba Pembakaran Alkohol',
    form: 'Tingkatan 5',
    chapter: 'Bab 3: Termokimia',
    category: 'Termokimia',
    description: 'Jalankan Eksperimen 3B (Rajah 3.13) menggunakan bekas kuprum & pengadang angin untuk menentukan ΔH pembakaran metanol, etanol, propanol & butanol serta plot graf Rajah 3.14.',
    learningStandard: 'SP 3.2.2 - Membandingkan haba pembakaran pelbagai jenis alkohol melalui eksperimen',
    iconName: 'Flame',
    colorTheme: 'orange',
    isImplemented: true,
    tags: ['Metanol', 'Etanol', 'Propanol', 'Bekas Kuprum', 'Graf Rajah 3.14']
  },
  {
    id: 'nilai-bahan-api',
    title: 'Nilai Bahan Api: Etanol, Petrol & Hidrogen',
    form: 'Tingkatan 5',
    chapter: 'Bab 3: Termokimia',
    category: 'Termokimia',
    description: 'Bandingkan nilai bahan api (kJ g⁻¹) bagi etanol, petrol, gas asli dan cecair hidrogen (Jadual 3.5/3.6), kira nilai bahan api dan kaji faktor pemilihan Rajah 3.15.',
    learningStandard: 'SP 3.3.1 - Membandingkan nilai bahan api dan mewajarkan pemilihan bahan api yang sesuai',
    iconName: 'Fuel',
    colorTheme: 'emerald',
    isImplemented: true,
    tags: ['kJ g⁻¹', 'Etanol 30', 'Petrol 34', 'Hidrogen 143', 'Rajah 3.15']
  },

  // --- Bab 4: Kimia Polimer ---
  {
    id: 'penggumpalan-lateks',
    title: 'Penggumpalan Lateks & Pencegahannya',
    form: 'Tingkatan 5',
    chapter: 'Bab 4: Kimia Polimer',
    category: 'Polimer & Bahan Industri',
    description: 'Uji tindakan asid metanoik (peneutralan cas negatif membran protein lateks) lawan larutan ammonia (mengekalkan cas negatif).',
    learningStandard: 'SP 4.1.3 - Menerangkan proses penggumpalan lateks dan pencegahannya',
    iconName: 'Disc',
    colorTheme: 'emerald',
    isImplemented: true,
    tags: ['Membran Protein', 'Asid Metanoik', 'Ammonia', 'Pemvulkanan']
  },

  // --- Bab 5: Kimia Konsumer dan Industri ---
  {
    id: 'penghasilan-sabun',
    title: 'Penghasilan Sabun (Saponifikasi)',
    form: 'Tingkatan 5',
    chapter: 'Bab 5: Kimia Konsumer dan Industri',
    category: 'Polimer & Bahan Industri',
    description: 'Didihkan minyak sawit bersama natrium hidroksida pekat dan tambahkan natrium klorida untuk memendakkan sabun.',
    learningStandard: 'SP 5.1.2 - Menghuraikan penyediaan sabun melalui saponifikasi',
    iconName: 'Sparkles',
    colorTheme: 'pink',
    isImplemented: true,
    tags: ['Saponifikasi', 'Tindakan Pencucian', 'Minyak Sawit', 'NaCl']
  }
];
