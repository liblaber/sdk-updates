import { Manifest } from './types/manifest'
import { Octokit } from '@octokit/rest'

const MANIFEST_PATH = '.manifest.json'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function fetchManifestFile(
  githubOrg: string,
  githubRepoName: string
): Promise<Manifest | undefined> {
  try {
    const remoteManifestJson = await fetchFileFromBranch({
      owner: githubOrg,
      path: MANIFEST_PATH,
      repo: githubRepoName
    })

    return JSON.parse(remoteManifestJson)
  } catch (error) {
    console.log(
      `Unable to fetch .manifest.json file from ${githubOrg}/${githubRepoName}`
    )
  }
}

export async function fetchFileFromBranch({
  owner,
  path,
  repo
}: {
  owner: string
  path: string
  repo: string
}): Promise<string> {
  const { data } = await octokit.repos.getContent({
    owner,
    path,
    repo
  })

  if (Array.isArray(data) || data.type !== 'file' || data.size === 0) {
    throw new Error(
      `Could not read content of file ${path} from repository ${repo}`
    )
  }

  return Buffer.from(data.content, 'base64').toString('utf8')
}
