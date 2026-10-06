## Taking over an external contributor's PR

Do not authorize GitHub Actions on external contributors' PRs.
Review the contribution, then cherry-pick reviewed commits onto an internal branch in `langchain-ai/langsmith-python-staging`.
Open a maintainer-owned replacement PR so CI can run there.

1. Review the original PR's complete diff and commit list before pushing.
   Include code, tests, dependencies, scripts and workflows that CI would execute.
   Moving code to an internal branch does not make it safe.
2. Start from the latest target branch in a clean checkout.
   Fetch the original PR's head and cherry-pick only reviewed commits, oldest first.
   Replace `123` with the original PR number and `main` with its target branch.
   Set the SHA variables to reviewed original commits; omit the second if unnecessary.

   ```bash
   git fetch origin
   git switch -c thibautlehmann/external-pr-123 origin/main
   git fetch origin pull/123/head
   git cherry-pick -x "$reviewed_commit_sha" "$next_reviewed_commit_sha"
   ```

   Use explicit commit SHAs, never a moving branch head.
   `-x` records the source commit; cherry-picking preserves the contributor's authorship.
   Resolve conflicts and review the resulting diff before continuing, or run `git cherry-pick --abort`.
3. Review the final diff against the target branch and run the relevant local checks.
   Push to this repository's `origin`, then open a replacement PR against the original target branch.
   Link the original PR, credit the contributor and explain changes made during the takeover.
   Agents should use their PR-creation tool when available.
4. Run CI and obtain the usual review on the replacement PR.
   Do not approve the original workflows or weaken CI security settings.
   Link the replacement from the original PR.
   Close the original as superseded once the replacement merges.

Review and cherry-pick any later contributor commits explicitly.
Do not automatically sync unreviewed updates.

## Setting up the environment

### With `uv`

We use [uv](https://docs.astral.sh/uv/) to manage dependencies because it will automatically provision a Python environment with the expected Python version. To set it up, run:

```sh
$ ./scripts/bootstrap
```

Or [install uv manually](https://docs.astral.sh/uv/getting-started/installation/) and run:

```sh
$ uv sync --all-extras
```

You can then run scripts using `uv run python script.py` or by manually activating the virtual environment:

```sh
# manually activate - https://docs.python.org/3/library/venv.html#how-venvs-work
$ source .venv/bin/activate

# now you can omit the `uv run` prefix
$ python script.py
```

### Without `uv`

Alternatively if you don't want to install `uv`, you can stick with the standard `pip` setup by ensuring you have the Python version specified in `.python-version`, create a virtual environment however you desire and then install dependencies using this command:

```sh
$ pip install -r requirements-dev.lock
```

## Modifying/Adding code

Most of the SDK is generated code. Modifications to code will be persisted between generations, but may
result in merge conflicts between manual patches and changes from the generator. The generator will never
modify the contents of the `src/langsmith/lib/` and `examples/` directories.

## Adding and running examples

All files in the `examples/` directory are not modified by the generator and can be freely edited or added to.

```py
# add an example to examples/<your-example>.py

#!/usr/bin/env -S uv run python
…
```

```sh
$ chmod +x examples/<your-example>.py
# run the example against your api
$ ./examples/<your-example>.py
```

## Using the repository from source

If you’d like to use the repository from source, you can either install from git or link to a cloned repository:

To install via git:

```sh
$ pip install git+ssh://git@github.com/langchain-ai/langsmith-python.git
```

Alternatively, you can build from source and install the wheel file:

Building this package will create two files in the `dist/` directory, a `.tar.gz` containing the source files and a `.whl` that can be used to install the package efficiently.

To create a distributable version of the library, all you have to do is run this command:

```sh
$ uv build
# or
$ python -m build
```

Then to install:

```sh
$ pip install ./path-to-wheel-file.whl
```

## Running tests

```sh
$ ./scripts/test
```

## Linting and formatting

This repository uses [ruff](https://github.com/astral-sh/ruff) and
[black](https://github.com/psf/black) to format the code in the repository.

To lint:

```sh
$ ./scripts/lint
```

To format and fix all ruff issues automatically:

```sh
$ ./scripts/format
```

## Publishing and releases

Changes made to this repository via the automated release PR pipeline should publish to PyPI automatically. If
the changes aren't made through the automated pipeline, you may want to make releases manually.

### Publish with a GitHub workflow

You can release to package managers by using [the `Publish PyPI` GitHub action](https://www.github.com/langchain-ai/langsmith-python/actions/workflows/publish-pypi.yml). This requires a setup organization or repository secret to be set up.

### Publish manually

If you need to manually release a package, you can run the `bin/publish-pypi` script with a `PYPI_TOKEN` set on
the environment.
