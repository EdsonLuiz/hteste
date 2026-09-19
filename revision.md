# Weather CLI Review

- [x] **Colors:** Cyan for menu, yellow for temperature, green for messages, red for errors (`src/colors.ts`, TTY-aware).
- [x] **Tests:** Storage and API tests with mocks via `bun test` (18 tests in `tests/`).
- [x] **Binary:** Compiles correctly; verified that `./weather` saves data to `~/.config/weather-cli/` (old `~/.weather-cli/` data migrated).
- [x] **Scalability:** Menu is now a data-driven registry (`MenuAction[]`); adding a feature means adding one entry.
- [x] **Loading:** `withLoading()` spinner shown for asynchronous tasks (weather, search, forecast).
- [x] **7 day forecast:** Options 6/7 render the next 7 days. Example output:
    [day of the month - min/max - condition]
    [day of the month - min/max - condition]