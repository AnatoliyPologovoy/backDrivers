import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';
import { runDB } from './db/mongo.db';

// создание приложения
// const app = express();
// setupApp(app);
//
// // запуск приложения
// app.listen(SETTINGS.PORT, () => {
//   console.log(`Example app listening on port ${SETTINGS.PORT}`);
// });

const start = async () => {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

start();
