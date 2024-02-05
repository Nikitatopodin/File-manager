import path from 'node:path';
import { access } from 'node:fs/promises';

const goUp = async (currentDir) => {
  const currentDirArr = currentDir.split('\\');
  if (currentDirArr.length === 1) {
    return currentDir;
  }
  const newDir = currentDirArr.slice(0, currentDirArr.length - 1).join('\\');
  return newDir;
}

const cd = async (currentDir, newDir) => {
  let result;
  try {
    result = path.join(currentDir, newDir);
    await access(result);
    return result;
  } catch (error) {
    try {
      result = path.join(newDir);
      await access(result);
      return result;
    } catch (error) {
      console.log('Operation failed');
      return currentDir;
    }
  }
}

export { goUp, cd };