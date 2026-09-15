import { ValidationError } from '../../core/types';
import {
  checkIsEmptyString,
  checkIsOverMaxLength,
  checkIsBoolean,
  checkIsOverRange,
  checkIsValidResolution,
  isValidISODate,
} from './utils';
import { UpdateVideoInputDto } from '../dto/videos.input.dto';

/** Проверка полей на валидность */
export const checkValidFieldsVideoInput = (
  video: UpdateVideoInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  Object.entries(video).forEach(([key, value]) => {
    switch (key) {
      // case 'email':
      //   if (checkIsNotEmail(value)) {
      //     errors.push({ field: key, message: 'Invalid email address' });
      //   }
      //   break;
      case 'title':
        if (checkIsEmptyString(value) || checkIsOverMaxLength(value, 40)) {
          errors.push({ field: key, message: 'Invalid data' });
        }
        break;
      case 'author':
        if (checkIsEmptyString(value) || checkIsOverMaxLength(value, 20)) {
          errors.push({ field: key, message: 'Invalid data' });
        }
        break;
      case 'availableResolutions':
        if (!checkIsValidResolution(value)) {
          errors.push({ field: key, message: 'Invalid data' });
        }
        break;
      case 'canBeDownloaded':
        if (!checkIsBoolean(value)) {
          errors.push({ field: key, message: 'Invalid data' });
        }
        break;
      case 'minAgeRestriction':
        if (value === null) {
          break;
        }
        if (checkIsOverRange(value, 1, 18)) {
          errors.push({ field: key, message: 'Invalid data' });
        }
        break;
      case 'publicationDate':
        if (!isValidISODate(value)) {
          errors.push({ field: key, message: 'Invalid data' });
        }
        break;
    }
  });
  return errors;
};

/** Проверка на наличие полей и их на валидность */
export const validationUpdateVideoInput = (
  video: UpdateVideoInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  return errors;
};
