import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const liblabToken: string = core.getInput('liblab_token', {
      required: true
    })
    const githubToken: string = core.getInput('github_token', {
      required: true
    })

    core.exportVariable('LIBLAB_TOKEN', liblabToken)
    core.exportVariable('GITHUB_TOKEN', githubToken)

    // Set outputs for other workflow steps to use
    core.setOutput('status', 'success')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
