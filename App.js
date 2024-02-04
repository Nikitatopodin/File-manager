import path, { join } from 'node:path';
import { fileURLToPath } from 'url';
import { goUp, cd } from '../node-file-manager/navigation.js';
import { list, cat, create, rn, cp, remove, move, calcHash, zip, unzip } from './fs.js';
import { logCPUArch, logCPUInfo, logEOL, logHomeDir, logUserName } from './os.js';
import { parsePaths } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApp = async () => {
  let welcomeMsg = '';
  const argvArr = process.argv.slice(2);
  let workingDir = __dirname;

  const input = process.stdin;

  input.on('data', async (data) => {
    const str = data.toString('utf-8').trim();
    switch (true) {
      case (str === 'up'):
        workingDir = await goUp(workingDir);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('cat')):
        console.log(await cat(join(workingDir, str.slice(4))));
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('ls')):
        await list(workingDir);
        console.log(`You are currently in ${workingDir}`);
        break;
      case (str.startsWith('rn')):
        const renamePaths = parsePaths(str.slice(3), workingDir);
        if (!renamePaths) break;
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
        if (!copyPaths) break;
        await cp(copyPaths.filePath, copyPaths.newFilePath);
        break;
      case (str.startsWith('mv')):
        const movePaths = parsePaths(str.slice(3), workingDir);
        if (!movePaths) break;
        await move(movePaths.filePath, movePaths.newFilePath);
        break;
      case (str.startsWith('compress')):
        const zipPaths = parsePaths(str.slice(9), workingDir);
        if (!zipPaths) break;
        await zip(zipPaths.filePath, zipPaths.newFilePath);
        break;
      case (str.startsWith('decompress')):
        const unzipPaths = parsePaths(str.slice(11), workingDir);
        if (!unzipPaths) break;
        await unzip(unzipPaths.filePath, unzipPaths.newFilePath);
        break;
    }
  })

  if (argvArr.length > 0) {
    argvArr.forEach((arg) => {
      if (arg.startsWith('--username')) {
        welcomeMsg += (`Welcome to the File Manager, ${arg.slice(11)}!`);
      }
    })
  }
  console.log(welcomeMsg);
  console.log(`You are currently in ${workingDir}`);
}
await startApp();