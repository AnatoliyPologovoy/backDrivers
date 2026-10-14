import { Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../settings/config';
import { initCollections } from './collections';

import dns from 'node:dns';
// Устанавливаем DNS-серверы Cloudflare или Google
dns.setServers(['1.1.1.1', '8.8.8.8']);

export let client: MongoClient;

// Подключение к БД
export async function runDB(url?: string): Promise<void> {
  if (!url) {
    console.log('❌ Database not connected: url not found');
    return;
  }

  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  // Инициализируем коллекции из подключённой базы.
  initCollections(db);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
