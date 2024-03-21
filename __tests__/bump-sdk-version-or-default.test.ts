import { bumpSdkVersionOrDefault } from '../src/set-languages-for-update'
import { Language } from '../src/types/language'
import { LibLabConfig } from '../src/types/liblab-config'
import * as fetchGitRepoFiles from '../src/fetch-git-repo-files'

const LIBLAB_CONFIG: LibLabConfig = {
  liblabVersion: '1',
  specFilePath: 'spec-path',
  publishing: { githubOrg: 'git-org' },
  languages: [Language.csharp],
  languageOptions: {
    csharp: {
      sdkVersion: '1.0.0',
      liblabVersion: '1',
      githubRepoName: 'some-repo'
    },
    go: {
      sdkVersion: '1.0.0',
      liblabVersion: '1',
      githubRepoName: 'some-repo'
    },
    terraform: {
      sdkVersion: '1.0.0',
      liblabVersion: '1',
      githubRepoName: 'some-repo'
    },
    java: {
      sdkVersion: '1.0.0',
      liblabVersion: '1',
      githubRepoName: 'some-repo'
    },
    typescript: {
      sdkVersion: '1.0.0',
      liblabVersion: '1',
      githubRepoName: 'some-repo'
    },
    python: {
      sdkVersion: '1.0.0',
      liblabVersion: '1',
      githubRepoName: 'some-repo'
    }
  }
}

describe('bump SDK version or default', () => {
  it('should bump patch version when no major liblabVersion SDK update', async () => {
    const mockFetchCurrentSdkVersion = jest.fn(async () => '1.0.0')
    jest
      .spyOn(fetchGitRepoFiles, 'fetchCurrentSdkVersion')
      .mockImplementation(mockFetchCurrentSdkVersion)
    const bumpedSdkVersion = await bumpSdkVersionOrDefault(
      Language.java,
      LIBLAB_CONFIG,
      '1.5.2'
    )

    expect(bumpedSdkVersion).toEqual('1.0.1')
  })

  it('should bump major SDK version when updating from liblabVersion 1 to 2', async () => {
    const liblabConfig = structuredClone(LIBLAB_CONFIG)
    liblabConfig.languageOptions.java!.liblabVersion = '2'
    const mockFetchCurrentSdkVersion = jest.fn(async () => '1.0.0')
    jest
      .spyOn(fetchGitRepoFiles, 'fetchCurrentSdkVersion')
      .mockImplementation(mockFetchCurrentSdkVersion)
    const bumpedSdkVersion = await bumpSdkVersionOrDefault(
      Language.java,
      liblabConfig,
      '1.5.2'
    )

    expect(bumpedSdkVersion).toEqual('2.0.0')
  })
})
