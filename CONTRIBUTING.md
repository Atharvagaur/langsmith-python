# Contributing

LangSmith SDK changes are developed in internal staging repositories and released from public production repositories.

## Set up the environment

We use [uv](https://docs.astral.sh/uv/) to manage dependencies and the Python version. Run:

```sh
./scripts/bootstrap
```

You can also install uv manually and sync the project:

```sh
uv sync --all-extras
```

Run Python commands with `uv run`, or activate the environment with:

```sh
source .venv/bin/activate
```

## Make changes

Most of the SDK is generated from the LangSmith API definition by Stainless. Do not edit generated files directly. CI rejects changes to files marked `File generated from our OpenAPI spec by Stainless.`

Handwritten client code spans `src/langsmith/`, including `client.py`, `run_trees.py`, `evaluation/`, and `sandbox/`; the `stlc-seal-custom-code` workflow preserves it through regeneration. Check the generated-file marker before editing: marked files should be changed in the API definition or `stainless.yml`, not directly. Handwritten examples belong in `examples/`.

## Add or run an example

Add an executable file under `examples/`, for example `examples/my_example.py`:

```python
#!/usr/bin/env -S uv run python

from langsmith import Client

client = Client()
```

Then run it with:

```sh
chmod +x examples/my_example.py
./examples/my_example.py
```

Examples call the configured LangSmith API, so set the endpoint and credentials for the environment you want to use.

## Use a local build

Build a wheel and install it into the environment you're testing:

```sh
uv build
uv pip install dist/*.whl
```

To install directly from this repository, use:

```sh
pip install git+ssh://git@github.com/langchain-ai/langsmith-python-staging.git
```

## Run checks

Run unit tests:

```sh
./scripts/test
```

To run one test file:

```sh
TEST=tests/unit_tests/test_client.py ./scripts/test
```

Format and lint with:

```sh
./scripts/format
./scripts/lint
```

## Open a pull request

External contributors should open issues and pull requests in the public `langsmith-python` repository. Staging is internal; maintainers review and port accepted changes while preserving contributor credit.

Internal development PRs target `langsmith-python-staging`. Production releases are promoted and published from `langsmith-python`; do not change package versions or publish directly from staging.
