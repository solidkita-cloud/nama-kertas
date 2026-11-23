export type ViolationCategory =
  | 'JUDOL'
  | 'PORNO'
  | 'SARA'
  | 'KATA_KOTOR'
  | 'UJARAN_KEBENCIAN'
  | 'DOXXING';

export interface ModerationResult {
  isSafe: boolean;
  isQuarantined: boolean;
  category?: ViolationCategory;
  categoryLabel?: string;
  matchedKeywords: string[];
  reasonText: string;
}

// Layer 1: Normalizer & Leet-speak Decoder
export function normalizeForModeration(input: string): string {
  if (!input) return '';

  let text = input.toLowerCase();

  // Decode common leet-speak substitutions
  text = text
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/8/g, 'b')
    .replace(/7/g, 't')
    .replace(/v/g, 'u');

  return text;
}

// Collapsed words (for bypassing separators: "s.l.o.t" -> "slot")
function getCollapsedText(text: string): string {
  return text.replace(/[^a-z0-9]/g, '');
}

// Layer 2: Filter Dictionaries
const DICTIONARIES: Record<
  ViolationCategory,
  { label: string; description: string; words: string[]; regex?: RegExp[] }
> = {
  JUDOL: {
    label: 'Judi Online (Segala Jenis)',
    description: 'Promosi, istilah, atau ajakan judi online / slot / togel / kasino.',
    words: [
      'slot',
      'gacor',
      'maxwin',
      'zeus',
      'pragmatic',
      'scatter',
      'mahjong',
      'mahjong ways',
      'rtp',
      'rtp live',
      'rtp slot',
      'depo',
      'deposit pulsa',
      'wd cepat',
      'togel',
      'toto macau',
      'toto gelap',
      'bandar togel',
      'bandar judi',
      'kasino',
      'casino',
      'poker online',
      'domino qiu',
      'judol',
      'judi',
      'judi online',
      'freebet',
      'agen slot',
      'link gacor',
      'situs gacor',
      'jackpot',
      'sensational',
      'olympus',
      'kakek zeus',
      'sweet bonanza',
      'starlight princess',
      'bet 200',
      'bocoran slot',
    ],
    regex: [
      /slot[a-z0-9-_]*gacor/i,
      /link[a-z0-9-_]*slot/i,
      /daftar[a-z0-9-_]*slot/i,
      /depo[0-9]+/i,
      /bonus[0-9]+%/i,
    ],
  },
  PORNO: {
    label: 'Pornografi & Konten Eksplisit',
    description: 'Muatan seksual eksplisit, pornografi, atau ajakan asusila.',
    words: [
      'bokep',
      'porn',
      'porno',
      'ngentot',
      'kontol',
      'memek',
      'pepek',
      'peli',
      'itil',
      'tetek',
      'toket',
      'bugil',
      'coli',
      'colmek',
      'open bo',
      'vcs',
      'live show mesum',
      'desah',
      'ngaceng',
      'sange',
      'crot',
      'jav',
      'nsfw',
      'sex tape',
      'mesum',
      'cumi basah',
      'isap kontol',
      'jilat memek',
      'kentu',
      'seks bebas',
      'telanjang',
    ],
    regex: [
      /open[a-z0-9\s]*bo/i,
      /vcs[a-z0-9\s]*sange/i,
      /video[a-z0-9\s]*bokep/i,
    ],
  },
  SARA: {
    label: 'Isu SARA & Sentimen Kebencian Golongan',
    description: 'Pelecehan, hinaan terhadap suku, agama, ras, atau golongan tertentu.',
    words: [
      'cina kafir',
      'cina bodoh',
      'islam kampung',
      'pribumi bangsat',
      'agama sesat',
      'kristen sesat',
      'kristenisasi',
      'teroris islam',
      'cokin',
      'hitam monyet',
      'dasar cina',
      'dasar papua',
      'dasar jawa bau',
      'dasar arab onta',
      'sesat musyrik laknat',
      'darah halal dibunuh',
      'kadrun',
      'cebong',
      'suku primitif',
      'sipit pelit',
    ],
    regex: [
      // Kombinasi: Suku/Agama + Kata Makian/Hinaan
      /\b(cina|tionghoa|cokin|sipit|pribumi|papua|jawa|batak|sunda|madura|bugis|dayak|arab|yahudi|islam|kristen|katolik|hindu|budha|buddha|syiah|wahabi|ahmadiyah|kafir)\b[\s,.-]+(bodoh|tolol|goblok|bego|dungu|idiot|anjing|babi|bangsat|keparat|kampung|sesat|miskin|monyet|najis|tai|biadab|laknat|penjajah|hina|musyrik|teroris|kadrun|cebong)\b/i,
      // Kombinasi kebalikannya: Kata Makian/Hinaan + Suku/Agama
      /\b(bodoh|tolol|goblok|bego|dungu|idiot|anjing|babi|bangsat|keparat|kampung|sesat|miskin|monyet|najis|tai|biadab|laknat|hina|dasar)\b[\s,.-]+(cina|tionghoa|cokin|sipit|pribumi|papua|jawa|batak|sunda|madura|bugis|dayak|arab|yahudi|islam|kristen|katolik|hindu|budha|buddha|syiah|wahabi|ahmadiyah|kafir)\b/i,
    ],
  },
  KATA_KOTOR: {
    label: 'Kata Kotor & Umpatan Kasar',
    description: 'Kata-kata umpatan kasar, makian, atau bahasa merendahkan.',
    words: [
      'tolol',
      'bodoh',
      'goblok',
      'bego',
      'dungu',
      'idiot',
      'anjing',
      'babi',
      'bangsat',
      'keparat',
      'jancuk',
      'jancok',
      'pantek',
      'puki',
      'pukimak',
      'bajingan',
      'kampret',
      'asu',
      'pantat busuk',
      'lonte',
      'perek',
      'kampang',
      'cukimai',
      'kimak',
      'tai',
      'taek',
      'modar',
      'mampus',
      'bangke',
      'setan alas',
      'iblis',
    ],
    regex: [
      /\b(tolol|goblok|bego|dungu|idiot|bangsat|keparat|bajingan|jancuk|jancok|pantek|pukimak)\b/i,
    ],
  },
  UJARAN_KEBENCIAN: {
    label: 'Ujaran Kebencian & Ajakan Kekerasan',
    description: 'Ancaman kekerasan, ajakan membunuh, fitnah keji, atau doxxing.',
    words: [
      'bunuh dia',
      'mati aja kamu',
      'mampus lu',
      'mati aja lu',
      'bantai saja',
      'penggal kepalanya',
      'gantung lehernya',
      'sebar foto bugilnya',
      'bakar rumahnya',
      'habisi keluarganya',
      'bunuh diri',
    ],
    regex: [
      /(bunuh|bantai|racun|penggal|habisi)\s+(dia|mereka|kamu|orang|lu|loe)/i,
    ],
  },
  DOXXING: {
    label: 'Doxxing & Penyebaran Kontak Pribadi',
    description: 'Penyebaran nomor telepon, NIK, alamat rumah, atau data pribadi orang lain.',
    words: [],
    regex: [
      /\b(08[1-9][0-9]{7,10})\b/, // Indonesian phone number
      /\b([1-9][0-9]{15})\b/,      // NIK KTP pattern (16 digits)
    ],
  },
};

// Layer 3: Evaluator Engine
export function inspectContent(title: string, content: string): ModerationResult {
  const combinedRaw = `${title} ${content}`;
  const normalized = normalizeForModeration(combinedRaw);
  const collapsed = getCollapsedText(normalized);

  // Extract individual words for exact token matching
  const tokens = normalized
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  // Priority check order: SARA -> JUDOL -> PORNO -> UJARAN_KEBENCIAN -> KATA_KOTOR -> DOXXING
  const checkOrder: ViolationCategory[] = [
    'SARA',
    'JUDOL',
    'PORNO',
    'UJARAN_KEBENCIAN',
    'KATA_KOTOR',
    'DOXXING',
  ];

  for (const cat of checkOrder) {
    const dict = DICTIONARIES[cat];
    const matched: string[] = [];

    // 1. Check exact keywords against token list and phrases
    for (const word of dict.words) {
      const lowerWord = word.toLowerCase();
      if (lowerWord.includes(' ')) {
        // Multi-word phrase check
        if (normalized.includes(lowerWord)) {
          matched.push(word);
        }
      } else {
        // Single word token check
        if (tokens.includes(lowerWord)) {
          matched.push(word);
        } else if (lowerWord.length >= 4 && collapsed.includes(lowerWord)) {
          // Obfuscated check (e.g. s.l.o.t or j-u-d-i)
          matched.push(word);
        }
      }
    }

    // 2. Check regex patterns
    if (dict.regex) {
      for (const rx of dict.regex) {
        if (rx.test(combinedRaw) || rx.test(normalized)) {
          matched.push(rx.source);
        }
      }
    }

    // If any violation found in this category
    if (matched.length > 0) {
      return {
        isSafe: false,
        isQuarantined: true,
        category: cat,
        categoryLabel: dict.label,
        matchedKeywords: Array.from(new Set(matched)),
        reasonText: `Surat ini tertahan di karantina karena terdeteksi memuat ${dict.label.toLowerCase()} (${dict.description}).`,
      };
    }
  }

  // Safe and clean!
  return {
    isSafe: true,
    isQuarantined: false,
    matchedKeywords: [],
    reasonText: 'Konten bersih dan lolos verifikasi berlapis.',
  };
}
