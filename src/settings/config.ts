import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';
const isDev = env.NODE_ENV === 'development';

export const SETTINGS = {
  PORT: env.PORT || 5001,
  MONGO_URI: isDev ? env.MONGODB_LOCAL_URI : env.MONGODB_URI,
  MONGO_ATLAS_URI: env.MONGODB_URI, //локально работает без vpn
  DB_NAME: 'backDrivers',
};
