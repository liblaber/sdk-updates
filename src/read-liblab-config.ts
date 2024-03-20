import fs from 'fs-extra'
import { LibLabConfig } from './types/liblab-config'

export const LIBLAB_CONFIG_PATH = './liblab.config.json'

export async function readLiblabConfig(): Promise<LibLabConfig> {
  if (!(await fs.pathExists(LIBLAB_CONFIG_PATH))) {
    throw new Error('liblab.config.json not found in the root directory.')
  }

  try {
    return (await fs.readJson(LIBLAB_CONFIG_PATH)) as LibLabConfig
  } catch (error) {
    // @ts-expect-error if customers removed liblab.config.json
    throw new Error(`Error reading liblab.config.json: ${error.message}`)
  }
}
