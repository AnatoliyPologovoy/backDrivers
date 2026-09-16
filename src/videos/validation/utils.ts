import { RESOLUTIONS } from '../constants';
import { Resolution } from '../types/video';

export const checkIsString = (value: unknown): value is string =>
  typeof value === 'string';

export const checkIsBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

export const checkIsNotArray = (value: unknown) => !Array.isArray(value);

export const checkIsEmptyString = (value: unknown) =>
  (checkIsString(value) && value.trim().length === 0) || !checkIsString(value);

export const checkIsNotEmail = (value: unknown) =>
  checkIsString(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const checkIsOverMaxLength = (value: unknown, maxLength: number) =>
  checkIsString(value) && value.length > maxLength;

export const checkIsOverRange = (value: unknown, min: number, max: number) => {
  const num = Number(value);
  return num < min || num > max;
};

export const checkIsNotEmptyArray = (array: unknown): array is Array<unknown> =>
  Array.isArray(array) && array.length > 0;

export const checkIsValidResolution = (value: unknown) => {
  if (checkIsNotEmptyArray(value)) {
    const Resolutions = Object.values(RESOLUTIONS);
    return value.every(
      (item) =>
        typeof item === 'string' && Resolutions.includes(item as Resolution),
    );
  }
  return false;
};

export function isValidISODate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString() === value;
}
