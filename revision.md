# Weather CLI Review

- [ ] **Colors:** None implemented; need to define cyan (menu), yellow (temp), and green/red (ok/error).
- [ ] **Tests:** None exist; it would be best to at least test storage and API interactions using mocks.
- [ ] **Binary:** Compiles correctly; verify that `./weather` saves data to `~/.config/weather-cli/`.
- [ ] **Scalability:** How easy will it be to add new features?
- [ ] **Loading:** Is there a loading state for asynchronous tasks?
- [ ] **7 day forecast:** Weather forecast for the next 7 days. Example output:
    [day of the month - min/max - rain, sun, cloudy]
    [day of the month - min/max - rain, sun, cloudy]