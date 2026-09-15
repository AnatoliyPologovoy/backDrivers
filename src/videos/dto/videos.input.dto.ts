import { Video } from '../types/video';

export type UpdateVideoInputDto = Omit<Video, 'id' | 'createdAt'>;
export type CreateVideoInputDto = Pick<
  Video,
  'title' | 'author' | 'availableResolutions'
>;
