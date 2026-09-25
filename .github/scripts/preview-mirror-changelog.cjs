const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { parseConventionalCommits } = require('release-please/build/src/commit.js');
const { DefaultChangelogNotes } = require('release-please/build/src/changelog-notes/default.js');

async function main() {
  const range = process.argv[2];
  if (!range || !range.includes('..') || range.startsWith('-')) {
    throw new Error('Usage: node .github/scripts/preview-mirror-changelog.cjs <base>..<head>');
  }
  const commits = execFileSync('git', ['log', '--reverse', '--format=%H', range, '--'], {
    encoding: 'utf8',
  }).trim().split('\n').filter(Boolean).map(sha => ({
    sha,
    message: execFileSync('git', ['show', '-s', '--format=%B', sha], { encoding: 'utf8' }),
  }));
  const config = JSON.parse(readFileSync('release-please-config.json', 'utf8'));
  const notes = await new DefaultChangelogNotes().buildNotes(parseConventionalCommits(commits), {
    owner: 'langchain-ai',
    repository: 'langsmith-python',
    version: 'preview',
    changelogSections: config['changelog-sections'],
  });
  console.log(notes);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
