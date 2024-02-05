import { join } from 'node:path';
import { access } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const zip = async (filePath, newFilePath) => {
  try {
    const filePathArr = filePath.split('\\');
    const fileName = filePathArr.slice(filePathArr.length - 1).join('\\');
    const newDirPath = join(newFilePath, fileName);
    await access(filePath);
    await pipeline(
      createReadStream(filePath),
      createBrotliCompress(),
      createWriteStream(newDirPath),
    );
  } catch {
    console.log('Operation failed');
  }
}

const unzip = async (filePath, newFilePath) => {
  try {
    const filePathArr = filePath.split('\\');
    const fileName = filePathArr.slice(filePathArr.length - 1).join('\\');
    const newDirPath = join(newFilePath, fileName);
    await access(filePath);
    await pipeline(
      createReadStream(filePath),
      createBrotliDecompress(),
      createWriteStream(newDirPath),
    );
  } catch {
    console.log('Operation failed');
  }
}

export { zip, unzip }