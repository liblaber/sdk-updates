import { bumpSdkVersionOrDefault } from '../src/set-languages-for-update'
import { Language } from '../src/types/language'
import * as fetchGitRepoFiles from '../src/fetch-git-repo-files'

describe('bump SDK version or default', () => {
  it('should bump patch version when no major liblabVersion SDK update', async () => {
    const mockFetchCurrentSdkVersion = jest.fn(async () => '1.0.0')
    jest
      .spyOn(fetchGitRepoFiles, 'fetchCurrentSdkVersion')
      .mockImplementation(mockFetchCurrentSdkVersion)
    const bumpedSdkVersion = await bumpSdkVersionOrDefault(
      Language.java,
      'git-org',
      'some-repo',
      '1',
      '1.5.2'
    )

    expect(bumpedSdkVersion).toEqual('1.0.1')
  })

  it('should bump major SDK version when updating from liblabVersion 1 to 2', async () => {
    const mockFetchCurrentSdkVersion = jest.fn(async () => '3.5.2')
    jest
      .spyOn(fetchGitRepoFiles, 'fetchCurrentSdkVersion')
      .mockImplementation(mockFetchCurrentSdkVersion)
    const bumpedSdkVersion = await bumpSdkVersionOrDefault(
      Language.java,
      'git-org',
      'some-repo',
      '2',
      '1.5.2'
    )

    expect(bumpedSdkVersion).toEqual('4.0.0')
  })
})
