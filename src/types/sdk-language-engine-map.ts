import { Language } from './language';
import { LiblabVersion } from './liblab-config';

export enum SdkEngines {
  CodeGen = 'code-gen',
  SdkGen = 'sdk-gen'
}

export enum SdkEngineVersions {
  CodeGen = '1.1.46',
  SdkGen = '2.1.7'
}

export const sdkLanguageEngineMap = {
  [Language.java]: SdkEngines.CodeGen,
  [Language.python]: SdkEngines.CodeGen,
  [Language.typescript]: SdkEngines.CodeGen,
  [Language.go]: SdkEngines.SdkGen,
  [Language.csharp]: SdkEngines.SdkGen,
  [Language.terraform]: SdkEngines.SdkGen,
  [Language.swift]: SdkEngines.SdkGen,
  [Language.php]: SdkEngines.SdkGen
};

export function getSdkEngine(
  language: Language,
  liblabVersion?: LiblabVersion
): SdkEngines {
  if (!liblabVersion || liblabVersion === '1') {
    const engine = sdkLanguageEngineMap[language];
    if (!engine) {
      throw new Error(`Unsupported language: ${language}`);
    }

    return engine;
  }

  return SdkEngines.SdkGen;
}
