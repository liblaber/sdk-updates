import process from 'process'
import { spawn } from 'child_process'

const cmdOutput: string[] = []

export async function cmd(...command: string[]): Promise<number> {
  const spawnProcess = spawn(command[0], command.slice(1), {
    env: {
      ...process.env
    }
  })
  return new Promise((resolve, reject) => {
    spawnProcess.stdout.on('data', handleProcessData)
    spawnProcess.stderr.on('data', handleProcessData)
    spawnProcess.on('exit', code => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(
          new Error(`Command '${command.join(' ')}' exited with code ${code}`)
        )
      }
    })
    spawnProcess.on('error', err => {
      reject(err)
    })
  })
}

function handleProcessData(data: Buffer): void {
  const lines = data.toString().split('\n')
  for (const line of lines) {
    if (!cmdOutput.includes(line)) {
      console.log(line)
      cmdOutput.push(line)
    }
  }
}
