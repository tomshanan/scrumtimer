export type BgState = 'day' | 'dusk' | 'dark';

export const sessionState = {
  SETUP: 'SETUP',
  STARTED: 'STARTED',
  FINISHED: 'FINISHED',
} as const;

export type SessionState = (typeof sessionState)[keyof typeof sessionState];

export interface ParticipantLog {
  participant: string;
  time: number;
  flag: boolean;
}

export interface Session {
  state: SessionState;
  timeLog: ParticipantLog[];
  participants: string[];
  currentParticipant: number;
}
