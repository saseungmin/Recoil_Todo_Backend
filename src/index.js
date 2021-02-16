import app from './app';

require('dotenv').config();

const { PORT } = process.env;

const port = PORT || 3001;
const { log: print } = console;

app.listen(port, () => {
  print(`${port}에서 실행중..`);
});
