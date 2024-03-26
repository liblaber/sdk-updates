import { Language } from './types/language';
import { LiblabVersion } from './types/liblab-config';
import semver from 'semver';

export const DEFAULT_SDK_VERSION = '1.0.0';

export async function bumpSdkVersion(
  language: Language,
  liblabVersion: LiblabVersion,
  languageVersion?: string,
  currentSdkVersion?: string
): Promise<string> {
  if (!currentSdkVersion) {
    console.log(
      `No SDK version set for ${language}, setting default version ${DEFAULT_SDK_VERSION}`
    );
    return DEFAULT_SDK_VERSION;
  }

  const currentSdkVersionSemVer = semver.parse(currentSdkVersion);

  if (!currentSdkVersionSemVer) {
    console.log(
      `The ${language} SDK version ${currentSdkVersion} is not a valid semver format. Defaulting to ${DEFAULT_SDK_VERSION}.`
    );
    return DEFAULT_SDK_VERSION;
  }

  const shouldBumpMajor =
    languageVersion &&
    semver.parse(languageVersion)?.major.toString() !== liblabVersion;

  const bumpedSdkVersion = shouldBumpMajor
    ? `${currentSdkVersionSemVer.inc('major').major.toString()}.0.0`
    : currentSdkVersionSemVer.inc('patch').version;

  console.log(
    `Bumping ${shouldBumpMajor ? 'major' : 'patch'} SDK version for ${language} from ${currentSdkVersion} to ${bumpedSdkVersion}`
  );

  return bumpedSdkVersion;
}
