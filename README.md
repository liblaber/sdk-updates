# Generate SDKs using latest liblab and publish PRs

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)

Generate SDKs using the latest liblab versions and publish PRs directly to your
SDK repositories.

This GitHub Action will regenerate your SDKs whenever there is a new release of
liblab.

This is a simple way of keeping your SDKs up to date with the latest liblab
releases.

For more information about GitHub integration with liblab, check
[our docs](https://developers.liblab.com/tutorials/integrate-with-github-actions).

## Usage

Add this workflow to your control repository:

```yaml
name: Latest liblab updates

on:
  workflow_dispatch:
  schedule:
    - cron: '0 11 * * *' # 11am UTC corresponds to 5am CST

jobs:
  generate-sdks-and-publish-prs:
    name: Generate SDKs and publish PRs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate SDKs and publish PRs
        #        uses: liblaber/sdk-updates@v1
        with:
          liblab_token: ${{ secrets.LIBLAB_TOKEN }}
          github_token: ${{ secrets.LIBLAB_GITHUB_TOKEN }}
```
