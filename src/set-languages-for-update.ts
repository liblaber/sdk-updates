import { LiblabConfig, LiblabVersion } from './types/liblab-config';
import { Language } from './types/language';
import semver from 'semver';
import {
  getSdkEngine,
  SdkEngines,
  SdkEngineVersions
} from './types/sdk-language-engine-map';
import { LIBLAB_CONFIG_PATH, readLiblabConfig } from './read-liblab-config';
import fs from 'fs-extra';
import { fetchManifestFile } from './fetch-git-repo-files';
import { bumpSdkVersion } from './bump-sdk-version';

const DEFAULT_LIBLAB_VERSION = '1';

export async function setLanguagesForUpdate(): Promise<string[]> {
  const liblabConfig = await readLiblabConfig();
  const languagesToUpdate = [];

  for (const language of liblabConfig.languages) {
    const languageOption = liblabConfig.languageOptions[language];

    if (!languageOption) {
      console.log(
        `${language} does not have languageOptions.${language} defined. Skipping ${language} SDK updates.`
      );
      continue;
    }

    if (!languageOption.githubRepoName) {
      console.log(
        `${language} does not have languageOptions.${language}.githubRepoName defined. Skipping ${language} SDK updates.`
      );
      continue;
    }

    const manifest = await fetchManifestFile(
      liblabConfig.publishing.githubOrg,
      languageOption.githubRepoName
    );

    if (
      // No manifest means that the SDK hasn't been built before, therefor we want to update
      !manifest ||
      (await shouldUpdateLanguage(
        language,
        manifest.liblabVersion,
        liblabConfig
      ))
    ) {
      const liblabVersion =
        languageOption.liblabVersion ||
        liblabConfig.liblabVersion ||
        DEFAULT_LIBLAB_VERSION;
      languageOption.sdkVersion = await bumpSdkVersion(
        language,
        liblabVersion,
        manifest?.liblabVersion,
        manifest?.config.sdkVersion
      );
      languagesToUpdate.push(language);
    } else {
      console.log(
        `SDK in ${language} is already generated with latest liblab.`
      );
    }
  }

  if (languagesToUpdate.length > 0) {
    liblabConfig.languages = [...languagesToUpdate];
    await fs.writeJson(LIBLAB_CONFIG_PATH, liblabConfig, { spaces: 2 });
  }

  return languagesToUpdate;
}

async function shouldUpdateLanguage(
  language: Language,
  languageVersion: string,
  liblabConfig: LiblabConfig
): Promise<boolean> {
  const [latestCodeGenVersion, latestSdkGenVersion] = [
    SdkEngineVersions.CodeGen,
    SdkEngineVersions.SdkGen
  ];

  const codeGenHasNewVersion = semver.gt(latestCodeGenVersion, languageVersion);
  const sdkGenHasNewVersion = semver.gt(latestSdkGenVersion, languageVersion);

  const liblabVersion =
    liblabConfig.languageOptions[language]?.liblabVersion ||
    liblabConfig.liblabVersion ||
    '1';

  if (liblabVersion === '1') {
    return (
      (codeGenHasNewVersion &&
        isSupported(SdkEngines.CodeGen, language, liblabVersion)) ||
      (sdkGenHasNewVersion &&
        isSupported(SdkEngines.SdkGen, language, liblabVersion))
    );
  } else if (liblabVersion === '2') {
    return sdkGenHasNewVersion;
  }

  throw new Error(
    `Unsupported liblabVersion: ${liblabVersion} in liblab.config.json.`
  );
}

function isSupported(
  sdkEngine: SdkEngines,
  language: Language,
  liblab: LiblabVersion
): boolean {
  try {
    return getSdkEngine(language, liblab) === sdkEngine;
  } catch (e) {
    return false;
  }
}
