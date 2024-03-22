import { Language } from './types/language'
import { Manifest } from './types/manifest'
import { Octokit } from '@octokit/rest'
import { DEFAULT_SDK_VERSION, MANIFEST_PATH } from './constants'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function fetchCurrentSdkVersion(
  language: Language,
  githubOrg: string,
  githubRepoName: string
): Promise<string> {
  try {
    switch (language) {
      case Language.java: {
        const pomXml = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'pom.xml',
          repo: githubRepoName
        })

        const javaSdkVersionMatch = pomXml.match(/<version>([\d.]+)<\/version>/)
        return javaSdkVersionMatch
          ? javaSdkVersionMatch[1]
          : DEFAULT_SDK_VERSION
      }
      case Language.typescript: {
        const packageJsonContent = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'package.json',
          repo: githubRepoName
        })

        const packageJson = JSON.parse(packageJsonContent)

        return packageJson.version || DEFAULT_SDK_VERSION
      }
      default: {
        return DEFAULT_SDK_VERSION
      }
    }
  } catch (error) {
    console.log(
      `Unable to fetch current ${language} SDK version. Defaulting to ${DEFAULT_SDK_VERSION}.`
    )
    return DEFAULT_SDK_VERSION
  }
}

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
