import { DisasterType } from './disasters/types';

export interface SafetyGuideItem {
  id: string;
  disasterType: DisasterType;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  emergencyHotlines: { name: string; number: string; role: string }[];
  duringAction: { step: number; title: string; instruction: string }[];
  beforeAction: { title: string; detail: string }[];
  afterAction: { title: string; detail: string }[];
  dos: string[];
  donts: string[];
  emergencyKitList: string[];
}

export const DISASTER_SAFETY_GUIDES: Record<DisasterType, SafetyGuideItem> = {
  earthquake: {
    id: 'gempa-bumi',
    disasterType: 'earthquake',
    title: 'Panduan Evakuasi & Penyelamatan Gempa Bumi',
    subtitle: 'Langkah Tanggap Darurat Saat Terjadi Guncangan Gempa',
    tagline: 'Drop, Cover, Hold On — Tetap tenang dan lindungi kepala',
    color: '#EF4444',
    emergencyHotlines: [
      { name: 'Panggilan Darurat', number: '112', role: 'Layanan Terpadu Tanggap Darurat' },
      { name: 'Basarnas', number: '115', role: 'Pencarian dan Pertolongan' },
      { name: 'BNPB / BPBD', number: '117', role: 'Penanggulangan Bencana' },
      { name: 'Polisi', number: '110', role: 'Bantuan Pengamanan & Evakuasi' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'DROP (Merunduk)',
        instruction: 'Segera merunduk ke lantai sebelum guncangan gempa menjatuhkan Anda.',
      },
      {
        step: 2,
        title: 'COVER (Berlindung)',
        instruction: 'Berlindunglah di bawah meja kokoh. Jika tidak ada meja, tutupi kepala dan leher dengan kedua tangan atau bantal.',
      },
      {
        step: 3,
        title: 'HOLD ON (Bertahan)',
        instruction: 'Pegang erat kaki meja hingga guncangan benar-benar berhenti.',
      },
      {
        step: 4,
        title: 'Jauhi Kaca & Benda Gantung',
        instruction: 'Hindari jendela kaca, lemari tinggi, lampu gantung, dan cermin yang berpotensi roboh atau pecah.',
      },
      {
        step: 5,
        title: 'Jangan Gunakan Lift',
        instruction: 'Gunakan tangga darurat. Jika sedang di dalam lift, tekan semua tombol lantai dan keluar begitu pintu terbuka.',
      },
    ],
    beforeAction: [
      { title: 'Identifikasi Tempat Aman', detail: 'Tentukan lokasi berlindung di setiap ruangan rumah dan kantor.' },
      { title: 'Amankan Furnitur Berat', detail: 'Kaitkan lemari, rak buku, dan peralatan tinggi ke dinding dengan bracket.' },
      { title: 'Siapkan Jalur Evakuasi', detail: 'Pastikan pintu keluar dan lorong bebas dari barang yang menghalangi.' },
    ],
    afterAction: [
      { title: 'Periksa Kebocoran Gas & Listrik', detail: 'Matikan kompor dan saklar utama jika mencium bau gas atau melihat kabel putus.' },
      { title: 'Keluar Menuju Lapangan Terbuka', detail: 'Jauhi tiang listrik, pohon rapuh, dinding retak, dan baliho besar.' },
      { title: 'Waspada Gempa Susulan', detail: 'Jangan langsung kembali ke dalam bangunan yang sudah retak.' },
    ],
    dos: [
      'Gunakan alas kaki tebal untuk menghindari pecahan beling',
      'Dengarkan informasi resmi dari BMKG atau BPBD lewat radio/ponsel',
      'Bantu lansia, anak-anak, dan penyandang disabilitas',
    ],
    donts: [
      'DILARANG menyalakan korek api atau saklar listrik jika ada bau gas',
      'DILARANG berlari panik keluar gedung bertingkat secara berdesakan',
      'DILARANG menyebarkan berita hoax atau prediksi gempa yang tidak resmi',
    ],
    emergencyKitList: [
      'Air minum mineral (minimal 3 liter per orang)',
      'Makanan kering tahan lama (biskuit, kurma, sarden)',
      'Senter LED & baterai cadangan',
      'Kotak P3K standar dan obat-obatan pribadi',
      'Peluit untuk meminta tolong saat terjebak',
      'Power bank berdaya terisi penuh',
      'Salinan dokumen penting dalam plastik kedap air',
    ],
  },

  flood: {
    id: 'banjir',
    disasterType: 'flood',
    title: 'Panduan Evakuasi & Keselamatan Banjir',
    subtitle: 'Prosedur Aman Menghadapi Genangan dan Luapan Air Deras',
    tagline: 'Turn Around, Don’t Drown — Jangan melintasi genangan berarus',
    color: '#3B82F6',
    emergencyHotlines: [
      { name: 'BPBD / BNPB', number: '117', role: 'Posko Penanganan Bencana Banjir' },
      { name: 'Basarnas', number: '115', role: 'Evakuasi Perahu Karet' },
      { name: 'Damkar', number: '113', role: 'Penyelamatan Darurat' },
      { name: 'PLN', number: '123', role: 'Pemutusan Aliran Listrik Tergenang' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Putus Aliran Listrik & Gas',
        instruction: 'Segera matikan meteran listrik utama (MCB) dan lepas regulator gas elpiji sebelum air masuk rumah.',
      },
      {
        step: 2,
        title: 'Amankan Dokumen & Barang Berharga',
        instruction: 'Pindahkan berkas penting, alat elektronik, dan obat-obatan ke lantai atas atau tempat tertinggi.',
      },
      {
        step: 3,
        title: 'Evakuasi Lebih Awal',
        instruction: 'Segera mengungsi ke posko yang ditentukan sebelum air mencapai ketinggian dada atau arus menjadi deras.',
      },
      {
        step: 4,
        title: 'Hindari Berjalan di Arus Deras',
        instruction: 'Arus air sedalam 15 cm sudah mampu menjatuhkan orang dewasa. Gunakan tongkat untuk meraba kedalaman tanah.',
      },
    ],
    beforeAction: [
      { title: 'Ketahui Titik Evakuasi', detail: 'Ketahui letak dataran tinggi, sekolah, atau balai desa terdekat yang aman.' },
      { title: 'Bersihkan Saluran Air', detail: 'Pastikan gorong-gorong dan selokan di lingkungan sekitar bebas dari sampah.' },
    ],
    afterAction: [
      { title: 'Hati-hati Hewan Berbisa', detail: 'Waspadai ular, kelabang, atau kalajengking yang berlindung di dalam rumah pasca-banjir.' },
      { title: 'Jangan Minum Air Tercemar', detail: 'Gunakan hanya air bersih yang telah direbus matang atau air kemasan.' },
      { title: 'Periksa Instalasi Listrik', detail: 'Pastikan seluruh instalasi kabel kering sempurna sebelum menyalakan daya kembali.' },
    ],
    dos: [
      'Gunakan pelampung atau jerigen kosong tertutup sebagai alat bantu apung darurat',
      'Prioritaskan evakuasi ibu hamil, anak kecil, dan lansia',
      'Gunakan sepatu bot karet untuk mencegah leptospirosis dan tertusuk benda tajam',
    ],
    donts: [
      'DILARANG menyentuh tiang listrik, gardu, atau kabel terendam',
      'DILARANG berkendara menembus banjir dengan ketinggian melebihi knalpot',
      'DILARANG membiarkan anak-anak berenang di genangan air banjir',
    ],
    emergencyKitList: [
      'Jas hujan dan pakaian hangat cadangan',
      'Obat anti-bakteri kulit, minyak kayu putih, dan antiseptik',
      'Plastik kedap air untuk ponsel dan dokumen',
      'Pelampung keselamatan atau ban dalam',
      'Biskuit dan makanan siap saji',
    ],
  },

  volcano: {
    id: 'gunung-api',
    disasterType: 'volcano',
    title: 'Panduan Keselamatan Letusan Gunung Api & Awan Panas',
    subtitle: 'Tindakan Tanggap Aktivitas Vulkanik dan Zona KRB PVMBG',
    tagline: 'Jauhi radius bahaya dan gunakan masker partikulat',
    color: '#F97316',
    emergencyHotlines: [
      { name: 'PVMBG / MAGMA ESDM', number: '022-7272606', role: 'Pusat Vulkanologi & Mitigasi' },
      { name: 'BPBD Siaga Erupsi', number: '117', role: 'Evakuasi Warga KRB' },
      { name: 'Basarnas SAR', number: '115', role: 'Evakuasi Darurat' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Patuhi Radius Bahaya (KRB)',
        instruction: 'Segera tinggalkan area jika Anda berada di dalam radius rekomendasi resmi PVMBG (misal 3 km, 5 km, atau 8 km).',
      },
      {
        step: 2,
        title: 'Lindungi Pernapasan',
        instruction: 'Gunakan masker N95 atau kain basah untuk menyaring partikel silika abu vulkanik beracun.',
      },
      {
        step: 3,
        title: 'Lindungi Mata & Kulit',
        instruction: 'Kenakan kacamata goggle rapat (hindari lensa kontak) dan pakaian tertutup lengan panjang.',
      },
      {
        step: 4,
        title: 'Jauhi Aliran Lembah & Sungai',
        instruction: 'Waspadai bahaya lahar dingin dan awan panas guguran yang mengalir dengan kecepatan sangat tinggi.',
      },
    ],
    beforeAction: [
      { title: 'Pahami Peta KRB', detail: 'Ketahui apakah domisili Anda masuk Kawasan Rawan Bencana I, II, atau III.' },
      { title: 'Siapkan Kacamata & Masker', detail: 'Stok masker N95/KF94 dan kacamata pelindung di rumah.' },
    ],
    afterAction: [
      { title: 'Bersihkan Abu dari Atap', detail: 'Segera sapu tumpukan abu vulkanik di atap rumah sebelum memberat dan meruntuhkan struktur atap saat hujan.' },
      { title: 'Tutup Tandon Air', detail: 'Pastikan penampungan air bersih tertutup rapat agar tidak terkontaminasi asam abu vulkanik.' },
    ],
    dos: [
      'Gunakan pakaian serba panjang dan topi pelindung',
      'Tetap berada di dalam ruangan tertutup jika hujan abu lebat',
      'Pantau terus pembaruan status MAGMA ESDM',
    ],
    donts: [
      'DILARANG mendekati kawah aktif atau memasuki zona radius steril',
      'DILARANG menggosok mata yang kemasukan abu (bilas dengan air bersih mengalir)',
      'DILARANG mengemudi kencang di jalanan berabu tebal karena sangat licin',
    ],
    emergencyKitList: [
      'Masker N95 / masker respirator partikulat',
      'Kacamata goggle tertutup',
      'Obat tetes mata steril',
      'Senter kuat menembus kabut abu',
      'Topi atau helm pengaman kepala',
    ],
  },

  'volcanic-ash': {
    id: 'abu-vulkanik',
    disasterType: 'volcanic-ash',
    title: 'Panduan Menghadapi Sebaran Abu Vulkanik & Gangguan Udara',
    subtitle: 'Proteksi Saluran Pernapasan, Sanitasi, dan Keselamatan Perjalanan',
    tagline: 'Tutup celah ventilasi dan lindungi sumber air bersih',
    color: '#FB923C',
    emergencyHotlines: [
      { name: 'Kemenkes / PSC', number: '119', role: 'Gangguan Saluran Pernapasan (ISPA)' },
      { name: 'AirNav Indonesia', number: '021-55915000', role: 'Info Pembatalan / Delay Penerbangan' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Karantina Ruangan Rumah',
        instruction: 'Tutup seluruh pintu, jendela, dan celah ventilasi dengan kain basah untuk mencegah abu masuk.',
      },
      {
        step: 2,
        title: 'Pakai Masker Filter & Kacamata',
        instruction: 'Kenakan masker N95 bila terpaksa beraktivitas di luar. Jangan gunakan lensa kontak sama sekali.',
      },
      {
        step: 3,
        title: 'Tutup Saluran & Penampungan Air',
        instruction: 'Tutup rapat tandon, sumur, dan wadah air agar partikel belerang dan asam silika tidak terminum.',
      },
      {
        step: 4,
        title: 'Kurangi Kecepatan Berkendara',
        instruction: 'Jarak pandang menurun drastis dan jalan menjadi licin seperti es jika abu terkena sedikit air hujan.',
      },
    ],
    beforeAction: [
      { title: 'Simpan Cadangan Air Bersih', detail: 'Tampung air sebelum hujan abu melanda lingkungan Anda.' },
      { title: 'Sediakan Masker & Lap Basah', detail: 'Siapkan persediaan masker di kendaraan dan rumah.' },
    ],
    afterAction: [
      { title: 'Sapu Abu dalam Keadaan Lembab', detail: 'Percikkan sedikit air sebelum menyapu abu agar tidak kembali terhirup beterbangan.' },
      { title: 'Periksa Filter Kendaraan', detail: 'Bersihkan saringan udara mobil dan sepeda motor dari sumbatan pasir vulkanik.' },
    ],
    dos: [
      'Bilas mata dengan air mengalir atau obat tetes mata steril',
      'Tutup makanan dan minuman dengan tudung saji rapat',
      'Bantu hewan ternak berlindung di kandang tertutup',
    ],
    donts: [
      'DILARANG menyalakan AC luar yang menyedot udara luar ruangan',
      'DILARANG menggosok mata dengan tangan kotor',
      'DILARANG berjalan di bawah genteng yang kelebihan beban abu basah',
    ],
    emergencyKitList: [
      'Masker N95 dalam jumlah cukup',
      'Kacamata pelindung (eye goggles)',
      'Obat tetes mata steril (cairan irigasi mata)',
      'Terpal penutup kendaraan atau tandon',
    ],
  },

  tsunami: {
    id: 'tsunami',
    disasterType: 'tsunami',
    title: 'Panduan Evakuasi Cepat Bencana Tsunami',
    subtitle: 'Golden Time 15-30 Menit: Lari ke Tempat Tinggi',
    tagline: 'Gempa Kuat di Pesisir? Segera Lari ke Tempat Tinggi Tanpa Menunggu!',
    color: '#06B6D4',
    emergencyHotlines: [
      { name: 'BMKG Peringatan Tsunami', number: '021-6546316', role: 'Pusat Gempa & Tsunami' },
      { name: 'Basarnas', number: '115', role: 'Penyelamatan Maritim' },
      { name: 'Panggilan Darurat', number: '112', role: 'Evakuasi Daerah' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Kenali Tanda Alam Tsunami',
        instruction: 'Jika merasakan gempa berayun kuat lebih dari 20 detik di dekat pantai, atau melihat air laut surut tiba-tiba, SEGERA EVAKUASI.',
      },
      {
        step: 2,
        title: 'Lari Menjauhi Pantai',
        instruction: 'Jangan menunggu sirene berbunyi. Segera lari ke tempat dengan ketinggian minimal 20 meter di atas permukaan laut.',
      },
      {
        step: 3,
        title: 'Evakuasi Vertikal (Jika Terjebak)',
        instruction: 'Jika tidak sempat mencapai bukit, panjat lantai 3 atau atap bangunan beton permanen (TES / Hotel Beton).',
      },
      {
        step: 4,
        title: 'Waspadai Gelombang Lanjutan',
        instruction: 'Gelombang tsunami pertama bukan yang paling berbahaya; gelombang kedua dan ketiga sering kali jauh lebih besar.',
      },
    ],
    beforeAction: [
      { title: 'Hafalkan Jalur Evakuasi Tsunami', detail: 'Ketahui rambu jalur evakuasi dan gedung shelter terdekat.' },
      { title: 'Latihan Bersama Keluarga', detail: 'Sepakati titik kumpul keluarga di dataran tinggi yang aman.' },
    ],
    afterAction: [
      { title: 'Tunggu Status Pencabutan Resmi BMKG', detail: 'Tetap bertahan di tempat tinggi sampai BMKG menyatakan ancaman tsunami berakhir.' },
      { title: 'Hindari Bangunan yang Dihantam Air', detail: 'Struktur bangunan berpotensi roboh diterjang arus balik air laut.' },
    ],
    dos: [
      'Evakuasi dengan berjalan/berlari kaki untuk menghindari kemacetan total kendaraan',
      'Pegang erat benda terapung kokoh jika terhanyut di dalam air',
      'Ikuti petunjuk rambu evakuasi jalur hijau',
    ],
    donts: [
      'DILARANG pergi ke pantai untuk menonton atau memungut ikan yang terdampar',
      'DILARANG menggunakan mobil pribadi di jalan sempit pesisir karena akan menimbulkan macet',
      'DILARANG kembali ke pantai sebelum pernyataan ancaman resmi dicabut',
    ],
    emergencyKitList: [
      'Pelampung keselamatan pribadi',
      'Peluit nyaring tahan air',
      'Senter anti-air',
      'Tas ransel kedap air berisi identitas diri dan obat rutin',
    ],
  },

  'forest-fire': {
    id: 'kebakaran-hutan',
    disasterType: 'forest-fire',
    title: 'Panduan Keselamatan Kebakaran Hutan & Kabut Asap (Karhutla)',
    subtitle: 'Mitigasi Paparan Asap Tebal PM2.5 dan Jalur Menghindar dari Api',
    tagline: 'Jauhi arah angin pembawa api dan gunakan masker respirator',
    color: '#DC2626',
    emergencyHotlines: [
      { name: 'Manggala Agni KLHK', number: '021-5745585', role: 'Pemadam Kebakaran Hutan' },
      { name: 'Pemadam Kebakaran', number: '113', role: 'Unit Pemadam Api' },
      { name: 'BPBD Karhutla', number: '117', role: 'Penanggulangan Kabut Asap' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Perhatikan Arah Angin',
        instruction: 'Lari tegak lurus dari arah tiupan angin yang membawa api dan asap tebal.',
      },
      {
        step: 2,
        title: 'Pasang Masker Anti-Partikulat',
        instruction: 'Gunakan masker N95 atau basahi kain dengan air untuk menyaring partikel karbon hitam karsinogenik.',
      },
      {
        step: 3,
        title: 'Basahi Pakaian & Sekitar Rumah',
        instruction: 'Jika api mendekati pekarangan, semprotkan air ke dinding luar, genteng, dan sekeliling semak.',
      },
      {
        step: 4,
        title: 'Evakuasi ke Safe House Bebas Asap',
        instruction: 'Kunjungi posko kesehatan ber-AC dengan filter HEPA jika Indeks Standar Pencemar Udara (ISPU) berbahaya.',
      },
    ],
    beforeAction: [
      { title: 'Buat Sekat Bakar', detail: 'Bersihkan semak kering berjarak minimal 10 meter dari bangunan tempat tinggal.' },
      { title: 'Siapkan Pasokan Air & Pompa', detail: 'Sediakan tandon air dan selang panjang di halaman.' },
    ],
    afterAction: [
      { title: 'Pantau Bara Api di Lahan Gambut', detail: 'Api gambut dapat menyala di bawah tanah selama berminggu-minggu tanpa terlihat.' },
      { title: 'Periksa Kesehatan Paru-paru', detail: 'Kunjungi faskes terdekat bila batuk berdahak, sesak napas, atau mata perih berkepanjangan.' },
    ],
    dos: [
      'Gunakan pembersih udara (air purifier) di kamar tertutup',
      'Banyak minum air putih hangat untuk membersihkan tenggorokan',
      'Tutup celah bawah pintu dengan handuk basah',
    ],
    donts: [
      'DILARANG membuka lahan dengan cara membakar serasah atau semak',
      'DILARANG membuang puntung rokok sembarangan di area kebun/hutan',
      'DILARANG berolahraga di luar ruangan saat indeks ISPU berwarna merah/hitam',
    ],
    emergencyKitList: [
      'Masker karbon aktif / respirator N95',
      'Obat inhaler bagi penderita asma',
      'Air minum ekstra',
      'Kacamata pelindung asap',
    ],
  },

  landslide: {
    id: 'tanah-longsor',
    disasterType: 'landslide',
    title: 'Panduan Keselamatan & Evakuasi Tanah Longsor',
    subtitle: 'Kewaspadaan Tebing Terjal di Musim Penghujan Lebat',
    tagline: 'Waspadai retakan tanah dan suara gemuruh di perbukitan',
    color: '#D97706',
    emergencyHotlines: [
      { name: 'BPBD Longsor', number: '117', role: 'Posko Bencana Daerah' },
      { name: 'Basarnas Search & Rescue', number: '115', role: 'Operasi Evakuasi Korban Longsor' },
      { name: 'Panggilan Darurat', number: '112', role: 'Bantuan Darurat Terpadu' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Kenali Tanda Awal Longsor',
        instruction: 'Retakan baru pada tanah, tiang/pohon miring mendadak, pintu rumah macet tidak bisa dibuka, atau air sumur menjadi keruh berlumpur.',
      },
      {
        step: 2,
        title: 'Dengar Suara Gemuruh',
        instruction: 'Jika terdengar suara gemuruh dari atas bukit saat hujan deras, SEGERA lari keluar rumah.',
      },
      {
        step: 3,
        title: 'Lari Tegak Lurus Arah Longsoran',
        instruction: 'Jangan lari searah dengan aliran longsoran. Larilah menyamping tegak lurus menjauhi lereng bukit.',
      },
      {
        step: 4,
        title: 'Cari Tanah Stabil dan Kokoh',
        instruction: 'Berlindunglah di area punggung bukit yang datar dan jauh dari aliran lumpur.',
      },
    ],
    beforeAction: [
      { title: 'Jangan Memotong Tebing Sembarangan', detail: 'Hindari mendirikan bangunan di bawah lereng curam tanpa dinding penahan (retaining wall).' },
      { title: 'Tanam Pohon Berakar Kuat', detail: 'Tanam tanaman pencegah erosi seperti akar wangi (vetiver) dan beringin di tebing.' },
    ],
    afterAction: [
      { title: 'Hindari Wilayah Longsoran Baru', detail: 'Kondisi tanah masih sangat labil dan dapat memicu longsor susulan jika hujan berlanjut.' },
      { title: 'Bantu Pendataan Korban', detail: 'Laporkan anggota keluarga atau tetangga yang diduga tertimbun kepada petugas SAR.' },
    ],
    dos: [
      'Segera mengungsi jika hujan deras berlangsung terus menerus lebih dari 3 jam di kawasan tebing',
      'Periksa drainase lereng agar air hujan mengalir lancar dan tidak meresap berlebihan ke tanah labil',
    ],
    donts: [
      'DILARANG mendekati tebing yang sudah menunjukkan rekahan tanah',
      'DILARANG tidur di kamar yang bersandar langsung pada dinding tebing saat hujan lebat malam hari',
      'DILARANG membangun kolam penampungan air terbuka di puncak tebing',
    ],
    emergencyKitList: [
      'Sepatu bot bergerigi anti-selip',
      'Senter kepala (headlamp)',
      'Peluit darurat',
      'Jas hujan anti-air',
      'Peralatan P3K untuk luka benturan',
    ],
  },

  'extreme-weather': {
    id: 'cuaca-ekstrem',
    disasterType: 'extreme-weather',
    title: 'Panduan Keselamatan Cuaca Ekstrem & Angin Kencang',
    subtitle: 'Perlindungan Diri dari Angin Puting Beliung, Petir, dan Hujan Es',
    tagline: 'Masuk ke dalam bangunan kokoh dan jauhi pohon serta reklame',
    color: '#8B5CF6',
    emergencyHotlines: [
      { name: 'BMKG Info Cuaca', number: '021-6546315', role: 'Radar Cuaca & Siklon' },
      { name: 'Damkar / Penyelamatan', number: '113', role: 'Penanganan Pohon Tumbang' },
      { name: 'PLN Darurat', number: '123', role: 'Kabel Listrik Tertimpa' },
    ],
    duringAction: [
      {
        step: 1,
        title: 'Berlindung di Bangunan Permanen',
        instruction: 'Masuklah ke bagian tengah ruangan rumah permanen. Jauhi jendela kaca besar.',
      },
      {
        step: 2,
        title: 'Jauhi Pohon Besar & Tiang Reklame',
        instruction: 'Angin kencang dapat merobohkan dahan rapuh dan baliho dalam sekejap.',
      },
      {
        step: 3,
        title: 'Hindari Lapangan Terbuka Saat Petir',
        instruction: 'Jangan berteduh di bawah pohon tunggal atau berada di dekat tiang logam dan air.',
      },
      {
        step: 4,
        title: 'Cabut Perangkat Elektronik',
        instruction: 'Matikan peralatan elektronik untuk mencegah kerusakan akibat lonjakan petir.',
      },
    ],
    beforeAction: [
      { title: 'Pangkas Dahan Rindang', detail: 'Pangkas cabang pohon di dekat atap atau kabel listrik rumah secara berkala.' },
      { title: 'Perkuat Kuncian Atap Seng', detail: 'Pastikan paku dan sekrup atap terpasang kuat menahan hembusan angin puting beliung.' },
    ],
    afterAction: [
      { title: 'Waspada Kabel Putus di Jalanan', detail: 'Jangan menginjak genangan air yang menyentuh kabel listrik terputus.' },
      { title: 'Laporkan Pohon Tumbang', detail: 'Hubungi dinas pertamanan atau Damkar untuk evakuasi batang pohon yang melintang.' },
    ],
    dos: [
      'Gunakan pelindung kepala jika terjadi hujan es',
      'Hentikan kendaraan dan menepi di tempat aman jika visibilitas berkurang drastis',
    ],
    donts: [
      'DILARANG berteduh di bawah jembatan penyeberangan atau papan reklame tinggi',
      'DILARANG memegang tiang besi saat petir menyambar',
      'DILARANG melanjutkan perjalanan sepeda motor saat badai angin menerpa',
    ],
    emergencyKitList: [
      'Senter darurat (emergency light)',
      'Power bank cadangan',
      'Jas hujan model setelan (bukan ponco)',
      'Obat anti-masuk angin dan demam',
    ],
  },

  drought: {
    id: 'kekeringan',
    disasterType: 'drought',
    title: 'Panduan Mitigasi Krisis Air & Kekeringan',
    subtitle: 'Manajemen Sumber Daya Air dan Pencegahan Dehidrasi',
    tagline: 'Hemat air bersih dan prioritaskan kebutuhan minum keluarga',
    color: '#EAB308',
    emergencyHotlines: [
      { name: 'PDAM / BPBD Air Bersih', number: '117', role: 'Bantuan Droping Air Tangki' },
      { name: 'Puskesmas Terdekat', number: '119', role: 'Konsultasi Penyakit Dehidrasi' },
    ],
    duringAction: [
      { step: 1, title: 'Prioritaskan Air untuk Minum & Memasak', instruction: 'Alokasikan cadangan air bersih utama untuk konsumsi dan kebersihan esensial.' },
      { step: 2, title: 'Gunakan Air Bekas untuk Tanaman', instruction: 'Gunakan air bilasan untuk menyiram tanaman atau menyiram toilet.' },
      { step: 3, title: 'Hindari Dehidrasi Saat Terik', instruction: 'Minum minimal 2-3 liter air per hari dan hindari paparan langsung sinar matahari di siang bolong.' },
    ],
    beforeAction: [
      { title: 'Panen Air Hujan', detail: 'Sediakan tandon pemanen air hujan (rainwater harvesting) di musim penghujan.' },
      { title: 'Jaga Tutupan Hutan Sumber Mata Air', detail: 'Lakukan reboisasi di wilayah tangkapan air hulu.' },
    ],
    afterAction: [
      { title: 'Perbaiki Saluran yang Bocor', detail: 'Segera tambal pipa atau keran air yang menetes terus-menerus.' },
      { title: 'Pilih Tanaman Tahan Kering', detail: 'Tanam palawija atau tanaman berakar dalam yang hemat air.' },
    ],
    dos: ['Tutup wadah penyimpanan air untuk mencegah jentik nyamuk demam berdarah', 'Laporkan kekurangan air ekstrem ke BPBD setempat untuk bantuan truk tangki'],
    donts: ['DILARANG mencuci kendaraan dengan air mengalir secara boros saat status darurat kekeringan', 'DILARANG membakar sampah di pekarangan kering'],
    emergencyKitList: ['Jerigen air bersih tertutup', 'Bubuk kaporit / tablet pemurni air steril', 'Oralit penangkal dehidrasi'],
  },

  'coastal-hazard': {
    id: 'bahaya-pesisir',
    disasterType: 'coastal-hazard',
    title: 'Panduan Mitigasi Abrasi, Gelombang Pasang, dan Rob',
    subtitle: 'Keselamatan Warga Pesisir dan Nelayan Tradisional',
    tagline: 'Perhatikan siklus pasang surut air laut dan peringatan gelombang tinggi',
    color: '#0284C7',
    emergencyHotlines: [
      { name: 'BMKG Maritim', number: '021-6546318', role: 'Prakiraan Gelombang Laut & Rob' },
      { name: 'Basarnas Maritim', number: '115', role: 'Pertolongan Kecelakaan Laut' },
    ],
    duringAction: [
      { step: 1, title: 'Amankan Kapal & Perahu', instruction: 'Tarik perahu nelayan lebih jauh ke daratan tinggi menjauhi garis pasang air laut tertinggi.' },
      { step: 2, title: 'Pasang Karung Pasir di Depan Rumah', instruction: 'Letakkan tanggul karung pasir untuk menahan limpasan rob masuk ke dalam hunian.' },
      { step: 3, title: 'Tunda Melaut Saat Peringatan Gelombang Tinggi', instruction: 'Patuhi maklumat pelayaran Syahbandar jika gelombang melebihi 2.5 meter.' },
    ],
    beforeAction: [
      { title: 'Tanam Hutan Mangrove', detail: 'Hutan bakau adalah benteng alami paling efektif memecah energi gelombang pasang.' },
      { title: 'Tinggikan Lantai Rumah', detail: 'Bangun rumah panggung atau naikkan lantai rumah di atas ketinggian pasang maksimum tercatat.' },
    ],
    afterAction: [
      { title: 'Bilas Garam dari Struktur Rumah', detail: 'Air laut memicu korosi besi beton dan pengeroposan dinding; bilas dengan air tawar jika memungkinkan.' },
    ],
    dos: ['Selalu kenakan jaket keselamatan (life jacket) saat berada di perahu', 'Pantau jadwal pasang maksimum astronomis (fase bulan purnama/baru)'],
    donts: ['DILARANG berenang di pantai saat bendera merah tanda bahaya gelombang terpasang', 'DILARANG merusak terumbu karang dan sabuk mangrove'],
    emergencyKitList: ['Pelampung keselamatan standar SOLAS', 'Radio panggil maritim (HT Marine)', 'Kotak obat tahan karat'],
  },
};

export function getSafetyGuide(type: DisasterType): SafetyGuideItem {
  return DISASTER_SAFETY_GUIDES[type] || DISASTER_SAFETY_GUIDES.earthquake;
}
