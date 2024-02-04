import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

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

export { zip, unzip }