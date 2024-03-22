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

        const versionMatch = pomXml.match(/<version>([\d.]+)<\/version>/)
        return versionMatch ? versionMatch[1] : DEFAULT_SDK_VERSION
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
      case Language.python: {
        const setupPy = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'package.json',
          repo: githubRepoName
        })

        const versionMatch = setupPy.match(/version='([\d.]+)'/)
        return versionMatch ? versionMatch[1] : DEFAULT_SDK_VERSION
      }
      case Language.csharp: {
        const csproj = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'Project.csproj', // Adjust the path as per your C# project structure
          repo: githubRepoName
        })

        const versionMatch = csproj.match(/<Version>([\d.]+)<\/Version>/)
        return versionMatch ? versionMatch[1] : DEFAULT_SDK_VERSION
      }
      case Language.php: {
        const composerJsonContent = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'composer.json',
          repo: githubRepoName
        })

        const composerJson = JSON.parse(composerJsonContent)
        return composerJson.version || DEFAULT_SDK_VERSION
      }
      case Language.swift: {
        const swiftPackageContent = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'Package.swift',
          repo: githubRepoName
        })

        const versionMatch = swiftPackageContent.match(/version: '([\d.]+)'/)
        return versionMatch ? versionMatch[1] : DEFAULT_SDK_VERSION
      }
      case Language.go: {
        const goModContent = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'go.mod',
          repo: githubRepoName
        })

        const versionMatch = goModContent.match(/v([\d.]+)/)
        return versionMatch ? versionMatch[1] : DEFAULT_SDK_VERSION
      }
      case Language.terraform: {
        const versionsTf = await fetchFileFromBranch({
          owner: githubOrg,
          path: 'versions.tf',
          repo: githubRepoName
        })

        const versionMatch = versionsTf.match(/required_version = "([\d.]+)"/)
        return versionMatch ? versionMatch[1] : DEFAULT_SDK_VERSION
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
