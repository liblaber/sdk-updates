import process from 'process';
import { spawn } from 'child_process';

const cmdOutput: string[] = [];

export async function cmd(...command: string[]): Promise<number> {
  const spawnProcess = spawn(command[0], command.slice(1), {
    env: {
      ...process.env
    }
  });
  return new Promise((resolve, reject) => {
    spawnProcess.stdout.on('data', deduplicateOutputAndPrint);
    spawnProcess.stderr.on('data', deduplicateOutputAndPrint);
    spawnProcess.on('exit', code => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(
          new Error(
            `Command '${printCommand(command)}' exited with code ${code}`
          )
        );
      }
    });
    spawnProcess.on('error', err => {
      reject(err);
    });
  });
}

function printCommand(command: string[]): string {
  const liblabIndex = command.indexOf('liblab');

  if (liblabIndex !== -1) {
    return `[${command.slice(liblabIndex).join(' ')}]`;
  }

  return `[${command.join(' ')}]`;
}

function deduplicateOutputAndPrint(data: Buffer): void {
  const lines = data.toString().split('\n');
  for (const line of lines) {
    if (!cmdOutput.includes(line) || line.includes('Owner:')) {
      console.log(line);
      cmdOutput.push(line);
    }
  }
}
