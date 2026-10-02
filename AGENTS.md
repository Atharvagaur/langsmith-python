# Instructions for code modifications in the Python SDK

This repo holds the LangSmith Python SDK: the hand-written client (tracing, run trees, evaluation, sandbox, wrappers, integrations) on top of a Stainless-generated REST client. Both live under `src/langsmith/`.

## External contributor PRs

Do not authorize GitHub Actions on external contributors' PRs.
Follow [Taking over an external contributor's PR](CONTRIBUTING.md#taking-over-an-external-contributors-pr) when taking over one.
Review before pushing, cherry-pick reviewed commits onto an internal branch, preserve contributor authorship, and open a replacement PR.

## Before opening a PR

Run from the repo root:

```
scripts/format
scripts/lint
scripts/test
```

`scripts/test` runs unit tests only. Integration, evaluation and external suites need a live deployment and API keys and run in CI. To run one file or pass pytest args:

```bash
TEST=tests/unit_tests/test_client.py scripts/test
```

Prefer CI over local runs when in doubt: shell or direnv `LANGSMITH_*` variables leak in and cause spurious local failures.

## Generated files

Files whose first line carries `File generated from our OpenAPI spec by Stainless.` are regenerated on every sync. Do not edit them. Change the OpenAPI spec or `stainless.yml` in `langchain-ai/langchainplus` instead. CI blocks PRs that touch them unless the PR has the `skip-stainless-generated-file-modification-check` label.

Hand-written code is sealed as custom code by the `stlc-seal-custom-code` workflow on every push to `main`, so it survives regeneration.

## Releasing

Releases are cut by release-please from conventional commits on `main`. Do not hand-edit the version in `pyproject.toml`, `src/langsmith/_version.py` or `.release-please-manifest.json`, and do not push tags.

## Conventions

### Constructing request URLs

Do not hardcode a leading `/v1` (or other `api_url`-dependent prefix) into request
paths. `LANGSMITH_ENDPOINT` may already include `/api/v1`, so a hardcoded
`/v1/...` produces a duplicated `/api/v1/v1/...` path and 404s.

For platform endpoints, build the path with the existing helpers so the `/v1`
prefix is only added when the configured `api_url` does not already end in `/v1`:

- `langsmith._internal._hub.platform_hub_path(api_url)` for hub (agent/skill) repos.
- `_platform_path(api_url, path)` / `_dataset_examples_path(api_url, dataset_id)`
  in `src/langsmith/client.py` for other platform paths.

When adding a new platform endpoint, follow the same pattern instead of inlining
`/v1/platform/...`.
