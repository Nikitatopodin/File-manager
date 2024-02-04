import { join } from 'node:path';
import { goUp, cd } from './navigation.js';
import { list, cat, create, rn, cp, remove, move } from './fs.js';
import { calcHash } from './hash.js';
import { zip, unzip } from './compression.js';
import { logCPUArch, logCPUInfo, logEOL, logHomeDir, logUserName } from './os.js';
import { parsePaths } from './utils.js';

const startApp = async () => {
  let welcomeMsg = '';
  let goodbyeMsg = '';
  const argvArr = process.argv.slice(2);
  let workingDir = await logHomeDir();

  if (argvArr.length > 0) {
    argvArr.forEach((arg) => {
      if (arg.startsWith('--username')) {
        welcomeMsg += `Welcome to the File Manager, ${arg.slice(11)}!`;
        goodbyeMsg += `Thank you for using File Manager, ${arg.slice(11)}, goodbye!`;
      }
    })
  }
  console.log(welcomeMsg);
  console.log(`You are currently in ${workingDir}`);

  const input = process.stdin;

  process.on('SIGINT', () => {
    console.log(goodbyeMsg);
    process.exit();
  });
  input.on('data', async (data) => {
    const str = data.toString('utf-8').trim();
    switch (true) {
      case (str === 'up'):
        workingDir = await goUp(workingDir);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('cat')):
        await cat(join(workingDir, str.slice(4)));
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('ls')):
        await list(workingDir);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('rn')):
        const renamePaths = parsePaths(str.slice(3), workingDir);
        if (!renamePaths) {
          console.log(`You are currently in ${workingDir}`);
          break;
        }
        await rn(renamePaths.filePath, renamePaths.newFilePath);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('add')):
        await create(workingDir, str.slice(4));
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('rm')):
        await remove(str.slice(3));
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('cd')):
        workingDir = await cd(workingDir, str.slice(3));
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str === 'os --EOL'):
        await logEOL();
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str === 'os --cpus'):
        await logCPUInfo();
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str === 'os --homedir'):
        await logHomeDir();
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str === 'os --username'):
        await logUserName();
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str === 'os --architecture'):
        await logCPUArch();
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('hash')):
        console.log(await calcHash(str.slice(5)));
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('cp')):
        const copyPaths = parsePaths(str.slice(3), workingDir);
        if (!copyPaths) {
          console.log(`You are currently in ${workingDir}`);
          break;
        }
        await cp(copyPaths.filePath, copyPaths.newFilePath);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('mv')):
        const movePaths = parsePaths(str.slice(3), workingDir);
        if (!movePaths) {
          console.log(`You are currently in ${workingDir}`);
          break;
        }
        await move(movePaths.filePath, movePaths.newFilePath);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('compress')):
        const zipPaths = parsePaths(str.slice(9), workingDir);
        if (!zipPaths) {
          console.log(`You are currently in ${workingDir}`);
          break;
        }
        await zip(zipPaths.filePath, zipPaths.newFilePath);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('decompress')):
        const unzipPaths = parsePaths(str.slice(11), workingDir);
        if (!unzipPaths) {
          console.log(`You are currently in ${workingDir}`);
          break;
        }
        await unzip(unzipPaths.filePath, unzipPaths.newFilePath);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str === '.exit'):
        console.log(goodbyeMsg);
        process.exit();
    }
  })
}
await startApp();