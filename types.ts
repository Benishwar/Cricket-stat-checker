
export enum Format {
  TEST = 'Test',
  ODI = 'ODI',
  T20I = 'T20I',
  IPL = 'IPL'
}

export interface StatRow {
  label: string;
  value: string | number;
  comparison?: string | number;
}

export interface CricketStats {
  playerName: string;
  format: string;
  batting: StatRow[];
  bowling: StatRow[];
  fielding: StatRow[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  groundingSources?: Array<{ title: string; uri: string }>;
  stats?: CricketStats;
  chartData?: any[];
}
