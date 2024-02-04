import path from 'node:path';

const goUp = async (currentDir) => {
  const currentDirArr = currentDir.split('\\');
  if (currentDirArr.length === 1) {
    return currentDir;
  }
  const newDir = currentDirArr.slice(0, currentDirArr.length - 1).join('\\');
  return newDir;
}

const cd = async (currentDir, newDir) => {
  const result = path.join(currentDir, newDir);
  return result
}

export { goUp, cd };