export type Rasa = 'KALUT' | 'GUNJING' | 'HARDIK' | 'RINDU' | 'TENANG';

export type StoryVisibility = 'PUBLIC' | 'MEMBERS_ONLY' | 'DRAFT' | 'QUARANTINED';

export interface QuarantineDetails {
  category: string;
  categoryLabel: string;
  reason: string;
  matchedWords: string[];
  quarantinedAt: string;
}

export interface Story {
  id: string;
  authorPaperName: string;
  authorId: string;
  title: string;
  content: string;
  rasa: Rasa;
  musicTheme: string;
  visibility: StoryVisibility;
  allowReplies: boolean;
  readingTimeMinutes: number;
  createdAt: string;
  isSaved?: boolean;
  quarantineDetails?: QuarantineDetails;
}

export interface Reply {
  id: string;
  storyId: string;
  authorPaperName: string;
  authorId: string;
  parentReplyId?: string | null;
  tier: 1 | 2 | 3;
  content: string;
  createdAt: string;
  isQuarantined?: boolean;
  quarantineReason?: string;
}

export interface User {
  id: string;
  paperName: string;
  email: string;
  isAdultVerified: boolean;
  paperNameLastChanged: string;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}

export interface RasaMeta {
  key: Rasa;
  label: string;
  cardTitle: string;
  description: string;
  ambientName: string;
  dotColor: string;
  tagBg: string;
}

export const RASA_DETAILS: Record<Rasa, RasaMeta> = {
  KALUT: {
    key: 'KALUT',
    label: 'Kalut',
    cardTitle: 'Sisinya Kalut',
    description: 'Pikiran yang muter terus, nggak jelas ujungnya. Bukan sedih, bukan marah, tapi bingung sama diri sendiri.',
    ambientName: 'Sepi Pelan',
    dotColor: '#C28236',
    tagBg: '#FAF2E6',
  },
  GUNJING: {
    key: 'GUNJING',
    label: 'Gunjing',
    cardTitle: 'Sisinya Gunjing',
    description: 'Ngomongin diri sendiri dari belakang. Nanya ke diri sendiri, kenapa tadi aku ketawa, kenapa tadi aku tiba-tiba diem.',
    ambientName: 'Hujan Pelan',
    dotColor: '#3E835E',
    tagBg: '#EDF5F0',
  },
  HARDIK: {
    key: 'HARDIK',
    label: 'Hardik',
    cardTitle: 'Sisinya Hardik',
    description: 'Suara di kepala yang jadi galak. Marah-marah ke diri sendiri tanpa ampun, padahal yang dimarahin ya diri sendiri juga.',
    ambientName: 'Angin Sunyi',
    dotColor: '#B85252',
    tagBg: '#F8EAEA',
  },
  RINDU: {
    key: 'RINDU',
    label: 'Rindu',
    cardTitle: 'Sisinya Rindu',
    description: 'Rindu yang sudah ikhlas. Sudah bilang sama-sama bahagia meski tak bersama, tapi tetap inget pas pernah berjumpa dan saling bercerita.',
    ambientName: 'Biru Malam',
    dotColor: '#4A698F',
    tagBg: '#EBF2FA',
  },
  TENANG: {
    key: 'TENANG',
    label: 'Tenang',
    cardTitle: 'Sisinya Tenang',
    description: 'Diam pun hati merasa indah. Nggak perlu rame, nggak perlu ketawa, cukup menjaga rasa.',
    ambientName: 'Kertas Pagi',
    dotColor: '#8C8042',
    tagBg: '#F5F4E4',
  },
};
