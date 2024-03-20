import { Language } from './language'
import { LiblabVersion } from './liblab-config'

export enum SdkEngines {
  CodeGen = 'code-gen',
  SdkGen = 'sdk-gen'
}

export enum SdkEngineVersions {
  CodeGen = '1.1.40',
  SdkGen = '2.0.18'
}

export const sdkLanguageEngineMap = {
  [Language.java]: SdkEngines.CodeGen,
  [Language.python]: SdkEngines.CodeGen,
  [Language.typescript]: SdkEngines.CodeGen,
  [Language.go]: SdkEngines.SdkGen,
  [Language.csharp]: SdkEngines.SdkGen,
  [Language.terraform]: SdkEngines.SdkGen
}

export function getSdkEngine(
  language: Language,
  liblabVersion?: LiblabVersion
): SdkEngines {
  if (!liblabVersion || liblabVersion === '1') {
    const engine = sdkLanguageEngineMap[language]
    if (!engine) {
      throw new Error(`Unsupported language: ${language}`)
    }

    return engine
  }

  return SdkEngines.SdkGen
}
