import { join } from 'node:path';
import { stat } from 'node:fs/promises'

const parseSinglePath = (str) => {
  const firstQuotes = str.indexOf('"');
  const secondQuotes = str.indexOf('"', firstQuotes + 1);
  if (secondQuotes !== -1 && secondQuotes !== 0) {
    const path = str.slice(firstQuotes + 1, secondQuotes);
    return path;
  }
  return str
}

const parsePaths = (str, workingDir) => {
  const firstQuotes = str.indexOf('"');
  const secondQuotes = str.indexOf('"', firstQuotes + 1);
  const thirdQuotes = str.indexOf('"', secondQuotes + 1);
  const fourthQuotes = str.indexOf('"', thirdQuotes + 1);
  if (fourthQuotes === -1 || fourthQuotes === 0) {
    console.log('Invalid input');
    return;
  }
  const firstPath = str.slice(firstQuotes + 1, secondQuotes);
  const secondPath = str.slice(thirdQuotes + 1, fourthQuotes);
  const filePath = join(workingDir, firstPath);
  const newFilePath = join(workingDir, secondPath);

  return { filePath, newFilePath }
}

const getStatsPromise = async (filePath) => {
  return new Promise((resolve) => {
    resolve(stat(filePath));
  })
}

export { parsePaths, parseSinglePath, getStatsPromise };