import { RESOLUTIONS } from '../constants';

export type Resolution = (typeof RESOLUTIONS)[keyof typeof RESOLUTIONS];

// Данные храним в массиве в памяти, поэтому id — обычное число (позже, с БД, станет строкой).
export type Video = {
  id: number;
  title: string; //maxLength: 40
  author: string; //maxLength: 20
  canBeDownloaded: boolean; //By default - false
  minAgeRestriction: number | null; // min 1 - max 18, null - no restriction
  createdAt: string; //string($date-time)
  publicationDate: string; //By default - +1 day from CreatedAt
  availableResolutions: Resolution[];
};
