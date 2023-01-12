import './common/env';
import bcrypt from 'bcrypt';
// import zookeeper from './common/zookeeper';

(async () => {
  // await zookeeper.loadConfig();
  await require('./api/config');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./api/db/connection');
  // await db.initialize();
  await require('./runServer');
  // await genPassword('A!@sdV?bSgZ98+)');
})();

async function genPassword(password: string) {
  const salt = await bcrypt.genSalt(8);
  const hashpwd = await bcrypt.hash(password, salt);
  console.log('Admin Has password', hashpwd);
}
