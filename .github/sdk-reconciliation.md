# Reconcile files excluded from SDK mirroring

Audit `langchain-ai/langsmith-sdk` through `1322234d3b88497955cf66851500ebc6910ee85e` (2 October 2026).

Initial mirror baseline: `b771c204344e33e913094517bfca43309a1a92c5`.
Staging code watermark at this audit: `5678a8c107dac62c4032a7468f80b2af4654c3e8`.

This audit accounts for excluded metadata and configuration. It does not advance the code watermark or claim the remaining code queue is drained.

## Source changes

Inspect every source commit after the initial mirror baseline, including commits with only excluded files and shared `.github/` changes. Check prior `Mirror-Manual-Port` records. This avoids treating an advanced watermark as proof of metadata parity.

| Source commit | Excluded paths | Status | Evidence or reason |
| --- | --- | --- | --- |
| [68342eae](https://github.com/langchain-ai/langsmith-sdk/commit/68342eae8047a39379c1f848390a7c5995a9166d) | `.github/workflows/openwiki-update.yml` | Excluded intentionally | Old-repo OpenWiki automation. Staging uses its own generated-client and custom-code workflows. |
| [e6863ca1](https://github.com/langchain-ai/langsmith-sdk/commit/e6863ca150cc678b737a236736ec878c1ee3c573) | `python/.bumpversion.cfg` | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below. |
| [2ad348e9](https://github.com/langchain-ai/langsmith-sdk/commit/2ad348e9720fe09c0996d2bf89fd6c2089e4c9e1) | `python/uv.lock` | Already present | uv.lock has soupsieve 2.9.2, newer than the source security fix at 2.9. |
| [33480442](https://github.com/langchain-ai/langsmith-sdk/commit/334804423e0b27e6ff0c9bd5644bde8a603bc297) | `python/.bumpversion.cfg` | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below. |
| [1d3e54ae](https://github.com/langchain-ai/langsmith-sdk/commit/1d3e54ae6bcb28cdf959553378734a0add0a279a) | `.github/scripts/mirror-since.sh`<br>`.github/scripts/mirror-to-staging.sh`<br>`.github/workflows/mirror-to-staging.yml` | Already present | Staging pulls through .github/workflows/mirror-from-langsmith-sdk.yml. The old push-based workflow is superseded. |
| [9207dfb6](https://github.com/langchain-ai/langsmith-sdk/commit/9207dfb6dfc7dea53b9574ce8ff37858e379dcea) | `.github/scripts/mirror-since.sh`<br>`.github/scripts/mirror-to-staging.sh`<br>`.github/workflows/mirror-to-staging.yml` | Already present | No push-based mirror workflow exists in staging; the pull workflow remains authoritative. |
| [8bf29abc](https://github.com/langchain-ai/langsmith-sdk/commit/8bf29abc896808f6d72eaca66fdfb5f24dd1ac8f) | `python/pyproject.toml`<br>`python/uv.lock` | Manually ported | Add sandbox-auth = [PyJWT[crypto]>=2.8.0] and the dev requirement; keep existing cryptography 50.0.1. |
| [c51e7220](https://github.com/langchain-ai/langsmith-sdk/commit/c51e722026138478b728884d9a3b504ef2ba8ea0) | `python/.bumpversion.cfg` | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below. |
| [3e225e3a](https://github.com/langchain-ai/langsmith-sdk/commit/3e225e3a1aec4f0b0e2b0bd3a188dc79da56d320) | `python/pyproject.toml`<br>`python/uv.lock` | Manually ported | Add tool.uv.exclude-newer = P7D. Keep previously reviewed locked versions; new resolutions use the source delay. |
| [a9520236](https://github.com/langchain-ai/langsmith-sdk/commit/a95202366a8eb1b7b7a9282507fbdffd312aebe5) | `python/.bumpversion.cfg` | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below. |
| [a21ffec3](https://github.com/langchain-ai/langsmith-sdk/commit/a21ffec356dc5bb2495bf1fed929ca6ec5c12534) | `python/uv.lock` | Already present | uv.lock already resolves urllib3 2.8.0. No upgrade or new runtime requirement is needed. |
| [26b3b5df](https://github.com/langchain-ai/langsmith-sdk/commit/26b3b5df39ed77d7e197da95fa130804fd21eeac) | `python/uv.lock` | Manually ported | Regenerate uv.lock with uv lock --upgrade-package pyjwt==2.15.0. No other package version changes. |
| [5f425645](https://github.com/langchain-ai/langsmith-sdk/commit/5f425645bc1d50e02f87607062ed93aa99578cde) | `python/.bumpversion.cfg` | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below. |
| [5077435f](https://github.com/langchain-ai/langsmith-sdk/commit/5077435f36aab3825840bdcc4548849b3fc8543a) | `AGENTS.md`<br>`CONTRIBUTING.md` | Manually ported | Add the external contributor takeover policy and agent link. Adapt the internal repository and branch prefix to staging; preserve review-before-push and contributor authorship. |
| [1322234d](https://github.com/langchain-ai/langsmith-sdk/commit/1322234d3b88497955cf66851500ebc6910ee85e) | `.github/workflows/ci.yml` | Excluded intentionally | Adds an old-repo Slack recipient and Open SWE investigation prompt. Preserve staging notification routing; no SDK or test behavior changes. |

Generated `_openapi_client` files are intentionally excluded. The staging REST client is generated from STLC/Stainless and sealed separately. Source generated blobs must not overwrite it.

## Manifest and packaging decisions

| Area | Decision |
| --- | --- |
| Runtime dependencies | Preserve all handwritten runtime requirements. Keep Stainless bounds on anyio, distro and typing-extensions; retain its sniffio declaration. |
| Optional integrations | Preserve all source extras and add the missing sandbox-auth extra. Keep staging-only aiohttp/httpx_aiohttp support. |
| Security constraints | Retain the source json-repair>=0.60.1 override so future resolutions cannot restore LiveKit's vulnerable pin. urllib3 and soupsieve were already patched. |
| Dev, lint and bench groups | Bench/lint/test groups match source. Dev retains Stainless test tools, pyright/mypy/pytest/Ruff settings and the httpx2 alias setup. Add source PyJWT[crypto]; do not downgrade tested tool versions. |
| Metadata | Keep package name langsmith, Python >=3.10, pytest plugin and production repository URLs. Match the source package description. |
| Wheel and sdist | Keep src/langsmith layout, hatch-fancy-pypi-readme and generated-client packaging. Do not copy source layout-specific Hatch or bumpversion settings. |
| Dependency maintenance | Use the source uv ecosystem at directory /. Target main; the inherited next branch does not exist. Keep the existing monthly grouping. |

The runtime manifest does not add urllib3 or PyJWT as unconditional requirements. urllib3 remains a requests dependency; PyJWT/cryptography stay behind sandbox-auth. The lock records the reviewed versions for development and CI. Installed wheels still resolve dependencies within their declared ranges.

## CI and release decisions

Keep staging build, unit, integration, package-import/export and generation checks. Source root CI changes in this range only add old-repo notification routing; they do not add missing test behavior. Shared Makefile/workspace files had no additional changes in this range.

Keep staging promotion and publishing workflows separate from old-repo release workflows. This PR does not enable promotion, publish a package, change repository visibility, or modify generated files.

1. First publication must use release-please to select a version above the published source SDK version: 0.14.3 (staging is currently 0.12.6).
2. Reconcile the manifest, pyproject.toml and src/langsmith/_version.py together through the release process. Do not copy skipped source version bumps manually.
3. Confirm the intended stable/prerelease channel and finish the production publishing pipeline under LIN-505/LIN-506 before publishing. The readiness follow-up switches release-please to stable releases; see release-readiness.md.

## Validation

1. `uv lock --check`: passed. Only PyJWT changes package version (2.14.0 to 2.15.0); urllib3 remains 2.8.0 and soupsieve remains 2.9.2.
2. `scripts/test-wheel-imports`: passed in a fresh environment, including installation of the sandbox-auth extra. The added check fails against unchanged staging metadata because that extra is absent.
3. `tests/unit_tests/sandbox/test_verify.py`: 39 passed with PyJWT 2.15.0.
4. Full unit run: 3096 passed, 1860 skipped, 1 xfailed; 4 failures and 48 errors. Local TCP binding accounts for 49 unsuccessful cases. An isolated rerun with TCP permitted and LANGSMITH_CONFIG_FILE set to a missing test path gives 417 passed, 3 skipped, 1 xfailed and 2 failures. Those two missing-key-warning tests clear the environment and read the local profile; both failures reproduce against unchanged staging main.
5. Ruff and pyright passed. Mypy reports the same nine errors in unchanged generated src/langsmith/_files.py as staging main. Bash syntax, YAML parsing and diff checks passed. actionlint is unavailable locally: its mise shim has no configured version.

Logs are retained with the local reconciliation checkout. CI and live integrations remain required before release.

## October 5 pipeline follow-up

Regenerate requirements-dev.lock from uv.lock: mypy now matches 2.3.1. Preserve the reviewed runtime bounds, extras, security floors and generated-client toolchain. Align the publisher with CI uv 0.10.2. Legacy completions tests use a mock HTTP transport because their model is retired; chat and other live integration coverage remains. Claude error results now fail before trace assertions.

The Linux/macOS/Windows language matrices, package checks, evals and four integration environments stay in place. See [release readiness](release-readiness.md) for preparation limits, registry trust, temporary release-as versions and the required merge strategy.

Manual ports through source `820e7700a355362a329fee1df5aaa91ab4e1e011`:

1. Source #3639: update anyio to 4.15.1, httpx2/httpcore2 to 2.13.1, livekit-agents to 1.8.3 and google-genai to 2.25.0. cachetools, strands-agents-tools, pytest-rerunfailures and debugpy already matched.
2. Source #3641, #3642 and #3643: types-psutil, types-requests and types-pyyaml already match; no duplicate lock edits.
3. Source #3656: port the excluded root conftest HTTPX cassette-reset fix.
4. Source #3651: finish the rejected deletion of obsolete `_address.py`; the replacement is `address.py`.
5. Isolate API-key warning tests and the Google ADK mock client from developer profile credentials. Preserve their assertions.
