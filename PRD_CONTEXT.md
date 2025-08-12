# goGreen PRD Context (LLM-Optimized)

Project snapshot
- Name: goGreen (Node.js script to backdate commits)
- Language/runtime: JavaScript (ES modules), Node.js
- Entrypoint: index.js
- Data file: data.json (stores last commit ISO timestamp)
- Package metadata: package.json (type: module)
- License: MIT
- Git required: local repo with a configured remote and valid credentials
- Dependencies: jsonfile ^6.1.0, moment ^2.30.1, random ^4.1.0, simple-git ^3.25.0

Goal
- Generate and push N backdated Git commits distributed across the past year to create/augment a “green” GitHub contribution graph.

Non-goals
- Not a general-purpose Git automation library
- No UI; no pattern rendering logic beyond random scatter
- No scheduling/daemon behavior

Primary users & use cases
- Individual developers wanting to fill contribution graphs
- Demo/testing of Git history manipulation

Current code layout
- /index.js: core logic (commit scheduling and execution)
- /data.json: single-key JSON { "date": ISOString }
- /package.json: npm metadata and deps; no run script
- /README.md: basic usage description
- /.gitignore: standard Node/VCS ignores

High-level behavior
- Compute dates within the last year using week/day offsets
- For each target date:
  - Write { date } to data.json
  - git add data.json; git commit --date <date>
- After the final commit: git push

Detailed flow (index.js)
- makeCommits(n):
  - Base case: if n === 0 → simpleGit().push()
  - Else: pick x ∈ [0,54], y ∈ [0,6]; date = now - 1y + 1d + x weeks + y days
  - jsonfile.writeFile(data.json, {date}, () => simpleGit().add([data.json]).commit(date, {"--date": date}, makeCommits(--n)))
- markCommit(x, y): constructs a date for exact grid placement (currently unused)

Functional requirements
- MUST create exactly N commits when invoked with N (current hardcoded N=100)
- MUST set the Git author date to the generated date for each commit
- MUST add and commit data.json to produce a content change each time
- MUST push to the default remote/branch after the sequence completes

Inputs, configuration, and assumptions
- N (number of commits): currently hardcoded at bottom of index.js (makeCommits(100))
- Requires: an initialized Git repo, configured remote, auth in environment (ssh-agent/https token)
- Time origin: moment() uses local machine timezone; DST/locale may affect exact timestamps

Data model
- data.json: { "date": string(ISO-8601) }

External dependencies and versions
- jsonfile: write data.json to disk
- moment: compute ISO timestamps via arithmetic on now
- random: uniform integers for week/day offsets
- simple-git: stage/commit/push via Git plumbing

Non-functional requirements
- Performance: sequential commits; acceptable for O(10^2–10^3) commits. No concurrency.
- Reliability: no retry/backoff; push performed once at the end
- Security: no secret handling in code; relies on user’s Git credentials; do not log secrets
- Ethics: this manipulates contribution histories; ensure users understand implications

Edge cases & risks
- Remote not configured or auth fails → push error
- Protected branch or required checks → push rejected
- Repo dirty state → staging conflicts
- File system write errors → commit callback not invoked
- Timezone/DST → visual placement may differ from expectation
- Large N → long process, potential rate limits or local performance hit

Known gaps (implementation backlog)
- CLI interface: accept flags (e.g., --count, --seed, --push-each, --from-date)
- Deterministic mode: seedable RNG for reproducible graphs
- Pattern mode: consume a bitmap or string to map (x,y) grid and call markCommit
- Error handling: async/await + try/catch, retries, and clear exit codes
- Logging: structured logs with summary on completion
- Config: .env or JSON config for repo/branch/commit density
- Throttling: optional delay between commits to reduce load
- Tests: unit tests with mocked simple-git and virtual FS
- Script: add npm run start to package.json for convenience

Acceptance criteria (v1)
- Running the script creates exactly N commits within the last 12 months and successfully pushes them
- data.json is updated per commit with the correct ISO timestamp
- No unhandled promise rejections; process exits with code 0 on success, non-zero on failure

Operational notes
- Running multiple times will continue to add commits; consider separate branches or squash strategy if needed
- Only the final push occurs (one network operation after all commits)

LLM implementation guidance
- Maintain ES module style (import ... from)
- Prefer async/await over nested callbacks for clarity
- Do not commit secrets; do not print tokens/credentials
- Validate preconditions (git repo, remote, auth) before starting
- Keep functions small and pure where possible; isolate Git side effects

Quick start (manual)
- Ensure: git init; git remote add origin <url>; auth configured
- Install deps: npm install
- Run: node index.js (hardcoded makeCommits(100))
- Verify: git log --pretty=oneline --date=iso; GitHub graph updates after push