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
  const homeDir = homedir();
  console.log(homeDir);
}

const logUserName = async () => {
  const userInform = userInfo();
  console.log(userInform.username);
}

const logCPUArch = async () => {
  const architecture = arch();
  console.log(architecture);
}

export { logEOL, logCPUInfo, logHomeDir, logUserName, logCPUArch }