import { readdir, appendFile, rename, rm, access } from 'node:fs/promises';
import { createReadStream, createWriteStream, } from 'node:fs';
import { join } from 'node:path';
import { getStatsPromise } from './utils.js';

const list = async (currentDir) => {
  const promiseArr = [];
  const resultArr = [];
  try {
    const files = await readdir(currentDir);
    for (let i = 0; i < files.length; i++) {
      try {
        promiseArr.push(await getStatsPromise(join(currentDir, files[i])));
      } catch { }
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
    const filePathArr = filePath.split('\\');
    const fileName = filePathArr.slice(filePathArr.length - 1).join('\\');
    const newDirPath = join(newDir, fileName);
    await access(filePath);
    const readStream = createReadStream(filePath);
    readStream.on('error', _ => console.log('Operation failed'));
    const writeStream = createWriteStream(newDirPath);
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
    const filePathArr = filePath.split('\\');
    const fileName = filePathArr.slice(filePathArr.length - 1).join('\\');
    const newDirPath = join(newDir, fileName);
    await access(filePath);
    const readStream = createReadStream(filePath);
    readStream.on('error', _ => console.log('Operation failed'));
    const writeStream = createWriteStream(newDirPath);
    readStream.pipe(writeStream);
    rm(filePath);
  } catch {
    console.log('Operation failed');
  }
}

export { list, cat, create, rn, cp, remove, move };