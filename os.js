import { EOL, cpus, homedir, userInfo, arch } from 'node:os'

const logEOL = async () => {
  console.log(JSON.stringify(EOL));
}

const logCPUInfo = async () => {
  const cpusInfo = cpus();
  const data = cpusInfo.map((cpuInfo) => {
    return [cpuInfo.model, (cpuInfo.speed / 1024).toPrecision(3) + 'GHz'];
  });
  const resultArray = data.map((info, index) => {
    if (index === data.length - 1) {
      return {
        model: info[0],
        speed: info[1],
        total: data.length
      }
    }
    return {
      model: info[0],
      speed: info[1],
    }
  })
  console.table(resultArray);
}

const logHomeDir = async () => {
  try {
    const homeDir = homedir();
    console.log(homeDir);
  } catch {
    console.log('Operation failed');
  }
}

const logUserName = async () => {
  try {
    const userInform = userInfo();
    console.log(userInform.username);
  } catch {
    console.log('Operation failed');
  }
}

const logCPUArch = async () => {
  try {
    const architecture = arch();
    console.log(architecture);
  } catch {
    console.log('Operation failed');
  }
}

export { logEOL, logCPUInfo, logHomeDir, logUserName, logCPUArch }