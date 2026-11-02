export type ColorGroup = 'red' | 'green' | 'blue';
export type SizeGroup = 'small' | 'big';
export type ParityGroup = 'odd' | 'even';

export interface AnimalData {
  number: number;
  khmerName: string;
  animalEn: string;
  color: ColorGroup;
  size: SizeGroup;
  parity: ParityGroup;
  odds: number;
}

export const ANIMALS_DATA: Record<number, AnimalData> = {
  1: { number: 1, khmerName: 'ជូត', animalEn: 'Rat', color: 'red', size: 'small', parity: 'odd', odds: 11 },
  2: { number: 2, khmerName: 'ឆ្លូវ', animalEn: 'Ox', color: 'green', size: 'small', parity: 'even', odds: 11 },
  3: { number: 3, khmerName: 'ខាល', animalEn: 'Tiger', color: 'blue', size: 'small', parity: 'odd', odds: 11 },
  4: { number: 4, khmerName: 'ថោះ', animalEn: 'Rabbit', color: 'red', size: 'small', parity: 'even', odds: 11 },
  5: { number: 5, khmerName: 'រោង', animalEn: 'Dragon', color: 'green', size: 'small', parity: 'odd', odds: 11 },
  6: { number: 6, khmerName: 'ម្សាញ់', animalEn: 'Snake', color: 'blue', size: 'small', parity: 'even', odds: 11 },
  7: { number: 7, khmerName: 'មមី', animalEn: 'Horse', color: 'red', size: 'big', parity: 'odd', odds: 11 },
  8: { number: 8, khmerName: 'មមែ', animalEn: 'Goat', color: 'green', size: 'big', parity: 'even', odds: 11 },
  9: { number: 9, khmerName: 'វក', animalEn: 'Monkey', color: 'blue', size: 'big', parity: 'odd', odds: 11 },
  10: { number: 10, khmerName: 'រកា', animalEn: 'Rooster', color: 'red', size: 'big', parity: 'even', odds: 11 },
  11: { number: 11, khmerName: 'ច', animalEn: 'Dog', color: 'green', size: 'big', parity: 'odd', odds: 11 },
  12: { number: 12, khmerName: 'កុរ', animalEn: 'Pig', color: 'blue', size: 'big', parity: 'even', odds: 11 },
};

export interface DrawResult {
  roundId: string; // e.g. "2004#284"
  roundIndex: number;
  time: string;    // e.g. "16:22"
  number: number;  // 1..12
  animal: string;
  color: ColorGroup;
  size: SizeGroup;
  parity: ParityGroup;
  timestamp: number;
}

export type BetCategory = 
  | 'small'       // 1.95
  | 'big'         // 1.95
  | 'odd'         // 1.95
  | 'even'        // 1.95
  | 'color_red'   // 2.95
  | 'color_green' // 2.95
  | 'color_blue'  // 2.95
  | `animal_${number}`; // 11

export interface ActiveBet {
  type: BetCategory;
  label: string;
  amount: number;
  odds: number;
}

export interface BetHistoryRecord {
  id: string;
  roundId: string;
  time: string;
  bets: {
    type: BetCategory;
    label: string;
    amount: number;
    odds: number;
    potentialWin?: number;
    won: boolean;
    payout: number;
  }[];
  totalStake: number;
  totalPotentialPayout: number;
  totalPayout: number;
  netProfit: number;
  resultNumber?: number;
  status: 'won' | 'lost' | 'pending';
}

export type PostLetter = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Lottery199Result {
  roundId: string;
  roundIndex: number;
  time: string;
  posts: Record<PostLetter, number>;
  timestamp: number;
}

export interface Lottery199BetRecord {
  id: string;
  roundId: string;
  time: string;
  posts: PostLetter[];
  numbers: string[];
  amountPerBet: number;
  totalStake: number;
  totalPayout: number;
  status: 'won' | 'lost' | 'pending';
  winningDetails?: { post: PostLetter; number: string; payout: number }[];
}
