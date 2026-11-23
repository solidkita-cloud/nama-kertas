import type { Story, Reply } from '../types';

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-gunjing-1',
    authorPaperName: 'semauku',
    authorId: 'user-semauku-3',
    title: 'Kadang berisik, tiba-tiba diem',
    content: `Ada manusia yang kadang berisik, lalu tiba-tiba diem. Tanpa ekspresi sama sekali. Bukan marah. Bukan juga hilang. Mungkin kepalanya sedang penuh, sampai kata-kata memilih pulang lebih dulu. 

Seperti lagu yang datar tapi jujur. Di kehidupan nyata, aku hanya manusia yang kadang berisik lalu tiba-tiba termenung. Kadang ketawa, tiba-tiba tidak berekspresi sama sekali. 

Seperti lagu Bernadya yang tanpa ekspresi, ya karena lagunya memang kayak gitu. Tanpa ekspresi itu justru ekspresinya. Dunia menuntut kita harus ceria di depan kamera atau di depan meja kantor, padahal ada kalanya wajah datar adalah cara terbaik untuk bertahan sampai jam pulang tiba.`,
    rasa: 'GUNJING',
    musicTheme: 'Hujan Pelan',
    visibility: 'PUBLIC',
    allowReplies: true,
    readingTimeMinutes: 1,
    createdAt: '23 November 2026',
    isSaved: false,
  },
  {
    id: 'story-rindu-2',
    authorPaperName: 'yang memilih lautan',
    authorId: 'user-ocean-1',
    title: 'Teruntuk Bulan yang Punya Bintang',
    content: `Teruntuk Bulan yang tak lagi tampak dalam perjalanan, entah kenapa kerinduan atasmu tak lagi sama sebagaimana dulu kita sering berjumpa. 

Seakan semesta tak menerima kebersamaan yang hampa dengan penuh tanya. Mau jadi apa kita nantinya, bersama tapi tak mungkin rasanya saat engkau bahagia punya bintang, aku di bumi memilih bersama lautan. 

Entah salah di perjumpaan atau waktu dan perasaan yang memang tak bisa dipertahankan. Terlalu mudah merasakan kerinduan atas keniscayaan, sudah lupakan kini kita sama-sama bahagia meski tak bersama. 

Aku masih ingin kita berjumpa, saling bercerita tentang kisah kita semua, engkau dan bintang begitu juga aku dan lautan.`,
    rasa: 'RINDU',
    musicTheme: 'Biru Malam',
    visibility: 'PUBLIC',
    allowReplies: true,
    readingTimeMinutes: 2,
    createdAt: '23 November 2026',
    isSaved: false,
  },
  {
    id: 'story-kalut-3',
    authorPaperName: 'yang lagi termenung',
    authorId: 'user-termenung-2',
    title: 'Kenapa Aku Tadi Ketawa?',
    content: `Kadang ceria itu hanya untuk orang yang ngerasa dirinya bisa ketawa, padahal mestinya dia harus lihat dekatnya. Sekeliling manusia yang hidupnya tak akan pernah sanggup berdiri tanpa lainnya. 

Orang-orang nyebutnya makhluk sosial, tapi bagiku itu bukan tentang bagaimana menjadi siapa tapi tentang mengerti cara bersikap. 

Ceria itu bahkan saat engkau terdiam ataupun menangis, tapi hatimu merasa hal indah. Ini tentang hati, bukan hanya ketawa yang terkadang saat sendiri engkau termenung sambil bergumam kenapa aku tadi ketawa? 

Manusia tak punya kuasa segala-galanya tapi jika mengerti cara menjaga rasa seharusnya semua berhak merasakan bahagia.`,
    rasa: 'KALUT',
    musicTheme: 'Sepi Pelan',
    visibility: 'PUBLIC',
    allowReplies: true,
    readingTimeMinutes: 2,
    createdAt: '23 November 2026',
    isSaved: false,
  },
  {
    id: 'story-hardik-4',
    authorPaperName: 'suara di lantai tiga',
    authorId: 'user-hardik-4',
    title: 'Berhenti Berlagak Kaget',
    content: `Berapa kali lagi kamu mau mengulang kesalahan yang sama lalu pura-pura kaget waktu semuanya runtuh? 

Berhenti menyalahkan orang lain atau cuaca atau waktu yang katanya berjalan terlalu cepat. Yang menunda dari pagi sampai malam itu tanganmu sendiri, yang menyalakan layar ponsel setiap kali ada hal penting yang harus dihadapi itu jarimu sendiri. 

Kamu terlalu pintar mencari pembenaran atas rasa malas yang dibungkus kata lelah. Bangun. Marah ke diri sendiri itu tidak ada gunanya kalau besok paginya kamu bersikap seperti anak kecil yang menunggu diselamatkan.`,
    rasa: 'HARDIK',
    musicTheme: 'Angin Sunyi',
    visibility: 'MEMBERS_ONLY',
    allowReplies: true,
    readingTimeMinutes: 2,
    createdAt: '23 November 2026',
    isSaved: false,
  },
  {
    id: 'story-tenang-5',
    authorPaperName: 'secangkir air hangat',
    authorId: 'user-tenang-5',
    title: 'Fajar dan Rintik yang Reda',
    content: `Tadi subuh, gerimis berhenti tepat saat adzan selesai berkumandang. 

Tidak ada yang istimewa, cuma ada secangkir air hangat di meja kayu dan bunyi lampu jalan yang padam otomatis karena langit timur mulai ungu. 

Ternyata hidup bisa seringan ini kalau kita tidak menuntut hari ini harus jadi hari yang besar atau bersejarah. Cukup ada di sini, menarik napas tanpa rasa bersalah, dan membiarkan dunia berputar tanpa harus kita beri komentar apa pun.`,
    rasa: 'TENANG',
    musicTheme: 'Kertas Pagi',
    visibility: 'PUBLIC',
    allowReplies: false,
    readingTimeMinutes: 1,
    createdAt: '23 November 2026',
    isSaved: false,
  },
];

export const INITIAL_REPLIES: Reply[] = [
  {
    id: 'reply-1',
    storyId: 'story-gunjing-1',
    authorPaperName: 'penjaga pesisir',
    authorId: 'user-pesisir',
    parentReplyId: null,
    tier: 1,
    content: 'Mungkin memang benar, tanpa ekspresi itu bukan berarti tidak merasa apa-apa. Kadang itu justru cara kepala istirahat.',
    createdAt: '23 November 2026, 21:30',
  },
  {
    id: 'reply-2',
    storyId: 'story-gunjing-1',
    authorPaperName: 'semauku',
    authorId: 'user-semauku-3',
    parentReplyId: 'reply-1',
    tier: 2,
    content: 'Iya, betul. Senang ada yang paham rasanya.',
    createdAt: '23 November 2026, 21:45',
  },
  {
    id: 'reply-3',
    storyId: 'story-gunjing-1',
    authorPaperName: 'langit kelabu',
    authorId: 'user-langit',
    parentReplyId: 'reply-2',
    tier: 3,
    content: 'Kadang kita cuma butuh duduk diam tanpa ditanya kenapa.',
    createdAt: '23 November 2026, 22:00',
  },
];
