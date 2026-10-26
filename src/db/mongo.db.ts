import { Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../settings/config';
import { initCollections } from './collections';

import os from 'node:os';
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

  // os-адаптер передаём явно: иначе драйвер грузит его через динамический import(),
  // который в vm-контексте Jest падает без --experimental-vm-modules.
  client = new MongoClient(url, { runtimeAdapters: { os } });
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

// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
