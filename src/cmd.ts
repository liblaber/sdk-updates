import process from 'process'
import { spawn } from 'child_process'

export async function cmd(...command: string[]): Promise<number> {
  const spawnProcess = spawn(command[0], command.slice(1), {
    stdio: 'inherit',
    env: {
      ...process.env
    }
  })
  return new Promise((resolve, reject) => {
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
