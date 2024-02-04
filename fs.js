import { readdir, appendFile, rename, rm, stat, access } from 'node:fs/promises';
import { createReadStream, createWriteStream, } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const hash = createHash('sha256');

const getStatsPromise = async (filePath) => {
  return new Promise((resolve) => {
    resolve(stat(filePath), (_, stats) => {
      return stats;
    })
  })
}

const list = async (currentDir) => {
  const dirPath = currentDir;
  const promiseArr = [];
  const resultArr = [];
  try {
    const files = await readdir(dirPath);
    for (let i = 0; i < files.length; i++) {
      promiseArr.push(await getStatsPromise(join(currentDir, files[i])));
    }
    for (let i = 0; i < promiseArr.length; i++) {
      resultArr.push({ Name: files[i], Type: promiseArr[i].isDirectory() ? 'directory' : 'file' });
    }
    resultArr.sort((a, b) => {
      if (a.Name > b.Name) {
        return -1;
      }
      if (a.Name === b.Name) {
        return 0;
      }
      return 1;
    })
    resultArr.sort((a, b) => {
      if (a.Type === 'directory') {
        return -1;
      }
      if (a.Type === b.Type) {
        return 0;
      }
      return 1;
    });
  } catch {
    console.log('Operation failed');
  }
  console.table(resultArr);
};

const cat = async (filePath) => {
  return new Promise((resolve) => {
    const readStream = createReadStream(filePath, 'utf-8');
    readStream.on('data', data => resolve(data));
    readStream.on('error', _ => console.log('Operation failed'));
  })
}

const create = async (currentDir, fileName) => {
  try {
    await appendFile(join(currentDir, fileName), '');
  } catch {
    console.log('Operation failed');
  }

}

const rn = async (filePath, newFilePath) => {
  console.log(filePath, newFilePath)
  const fileDirArr = filePath.split('\\');
  const fileDir = fileDirArr.slice(0, fileDirArr.length - 1).join('\\');
  const newFileDirArr = newFilePath.split('\\');
  const newFileDir = join(fileDir, newFileDirArr.slice(newFileDirArr.length - 1).join(''));
  try {
    await rename(filePath, newFileDir);
  } catch {
    console.log('Operation failed');
  }
}

const cp = async (filePath, newDir) => {
  try {
    await access(filePath)
    const readStream = createReadStream(filePath);
    readStream.on('error', _ => console.log('Operation failed'));
    const writeStream = createWriteStream(newDir);
    readStream.pipe(writeStream);
  } catch {
    console.log('Operation failed')
  }
}

const remove = async (filePath) => {
  try {
    await rm(filePath);
  } catch {
    console.log('Operation failed')
  }
}

const move = async (filePath, newDir) => {
  try {
    await access(filePath);
    const readStream = createReadStream(filePath);
    readStream.on('error', _ => console.log('Operation failed'));
    const writeStream = createWriteStream(newDir);
    readStream.pipe(writeStream);
    rm(filePath);
  } catch {
    console.log('Operation failed');
  }
}

const calcHash = async (filePath) => {
  return new Promise((resolve) => {
    const input = createReadStream(filePath);
    input.on('data', (data) => {
      resolve(hash.update(data).digest('hex'));
    })
    input.on('error', _ => console.log('Operation failed'));
  })
}

const zip = async (filePath, newFilePath) => {
  try {
    await access(filePath);
    await pipeline(
      createReadStream(filePath),
      createBrotliCompress(),
      createWriteStream(newFilePath),
    );
  } catch {
    console.log('Operation failed')
  }

}

const unzip = async (filePath, newFilePath) => {
  try {
    await access(filePath);
    await pipeline(
      createReadStream(filePath),
      createBrotliDecompress(),
      createWriteStream(newFilePath),
    );
  } catch {
    console.log('Operation failed');
  }

}

export { list, cat, create, rn, cp, remove, move, calcHash, zip, unzip };