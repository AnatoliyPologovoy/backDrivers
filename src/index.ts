import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';

// создание приложения
const app = express();
setupApp(app);

// запуск приложения
app.listen(SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${SETTINGS.PORT}`);
});
