import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

const hash = createHash('sha256');

const calcHash = async (filePath) => {
  return new Promise((resolve) => {
    const input = createReadStream(filePath);
    input.on('data', (data) => {
      resolve(hash.update(data).digest('hex'));
    })
    input.on('error', _ => console.log('Operation failed'));
  })
}
export { calcHash }