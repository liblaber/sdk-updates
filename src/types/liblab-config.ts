import { Language } from './language'

export interface LibLabConfig {
  liblabVersion: LiblabVersion
  languages: Language[]
  specFilePath: string
  publishing: {
    githubOrg: string
  }
  languageOptions: {
    java: LanguageOption
    typescript: LanguageOption
    python: LanguageOption
    go: LanguageOption
    csharp: LanguageOption
    terraform: LanguageOption
  }
}

export type LiblabVersion = '1' | '2'

export interface LanguageOption {
  githubRepoName: string
  sdkVersion: string
  liblabVersion: LiblabVersion
}
