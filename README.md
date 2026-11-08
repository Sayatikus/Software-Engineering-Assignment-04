# Smart Campus - Software Engineering Assignment #04
**Zhaulybek Sayat | 24B031037 | Friday 14:00-17:00**

A responsive React/TypeScript availability checker using six fictional rooms, room-specific bookings, capacity filtering and ALL-required-equipment filtering. Fixed fictional current time: 09:00. No login, backend, external API or booking writes.

## Setup and run
Use **Node.js >=22.18** (tested 24.13.1) and npm (tested 11.8.0).

```sh
npm ci
npm run dev -- --host 127.0.0.1
```
Open http://127.0.0.1:5173. For production: `npm run build`, then `npm run preview`.

## Verification
```sh
npm test
npm run typecheck
npm run lint
npm run build
```
Actual final result: **33/33 Node tests**, typecheck/lint/build exit 0. Baseline: **18/18 unchanged original regression tests**. `evidence/` stores real terminal output, including failures. Build warns about old Browserslist data; it still exits 0.

Optional standalone UI runner (keep Vite running in another terminal):
```sh
npx playwright install chromium
npm run test:ui
# Or use an installed Chrome:
PLAYWRIGHT_CHANNEL=chrome npm run test:ui
```
`BASE_URL` can point to a different running preview URL. **The standalone runner did not complete in this desktop environment:** Chrome process launch failed before any scenario. Do not describe it as passed. Connected Chrome was used separately: 18/18 actual assertions passed, including 390px and 320px no-overflow checks. See `evidence/browser-connector-ui.txt` and real screenshots. The portable runner contains 12 scenarios, not the same count as connector assertions.

## Demonstration
1. Enter 35 attendees; select Projector and Computers -> only Turing matches (F1/F2).
2. Enter 201 -> clear empty state (F4).
3. Reset. Select Athena and check 10:00-11:00 -> unavailable due to overlap.
4. Switch to Turing -> available immediately; switch to Curie -> blocked (F3/F5).
5. Set 12:01 end with 10:00 start -> reject 121 minutes. 10:00-12:00 is exactly 120 and Turing is free. 23:00-24:00 is valid. Current time stays 09:00.
6. Repeated checks do not create or change bookings. Narrow page layouts remain usable (AC5/AC6).

## Requirement traceability
| Requirement | Implementation | Executed evidence |
|---|---|---|
| AC1 valid/future time | time.ts, bookingLogic.validateInterval | T02-T05, T17-T18; parser/nonfinite tests; browser malformed/24:00 |
| AC2 <=120 minutes | validateDuration | T06 exactly 120; T07 121; browser duration |
| AC3 blocked | checkAvailability | T13; F3 test; browser Curie |
| AC4 overlap, endpoints allowed | findOverlaps and roomId guard | T01, T08-T12, T14, T16 |
| AC5 immutable data + clear decision | pure rules + ResultPanel | T15 and frozen fixtures; repeated browser check |
| AC6 responsive/clear feedback | responsive layout + labeled fields/live status | actual Chrome 390/320px checks/screenshots |
| F1 capacity >= attendees | filterRooms | exact 40 vs insufficient 41, UI02 |
| F2 ALL selected equipment | equipment.every | AND-equipment/combined filters, UI03 |
| F3 blocked never available | original room rule | F3 + UI08 |
| F4 empty state | App no-match branch | impossible capacity + UI04 |
| F5 refresh chosen room | derived evaluateSelection result | integration different-room bookings + UI07/UI09/UI10 |

## Modules
- `src/lib/sampleData.ts`: fictional catalog and booking fixtures joined by roomId.
- `src/lib/types.ts`: shared contracts; room equipment is explicit.
- `src/lib/time.ts`: parser and formatter.
- `src/lib/bookingLogic.ts`: original validation and overlap rules, compatible API.
- `src/lib/roomFilters.ts`: pure capacity/ALL-equipment selection.
- `src/lib/selection.ts`: adapts chosen room and text times into rules; fixed clock.
- `src/components/`: RoomFilters, TimeForm, BookingList plus retained RoomCard, Timeline, ResultPanel.
- `src/App.tsx`: input state and composition; no independently stored stale CheckResult.

## Initial and final source
Published repository: [https://github.com/Sayatikus/Software-Engineering-Assignment-04](https://github.com/Sayatikus/Software-Engineering-Assignment-04).

- [Baseline branch](https://github.com/Sayatikus/Software-Engineering-Assignment-04/tree/baseline-a04): `03d7cd408213e0d365785e858171821b331eda14`.
- [Final application branch](https://github.com/Sayatikus/Software-Engineering-Assignment-04/tree/final-code-a04): `55c66603b947e01480ece2c2385ffbe9c66c4610`.
- [Compare initial and final code](https://github.com/Sayatikus/Software-Engineering-Assignment-04/compare/baseline-a04...final-code-a04).
- `main`: final application plus PDF, README, analysis and evidence appendix.

```sh
git clone https://github.com/Sayatikus/Software-Engineering-Assignment-04.git
cd Software-Engineering-Assignment-04
git show origin/baseline-a04:src/App.tsx
git diff origin/baseline-a04 origin/final-code-a04 -- src
# Inspect the original in a separate directory:
git worktree add ../smart-campus-baseline origin/baseline-a04
cd ../smart-campus-baseline
node --test tests/booking.test.mjs
```

The baseline is the actual existing **six-room** export with no equipment filters. All 18 baseline tests are unchanged in the final version. Browser uploads recreated the commit history on GitHub: all **25 baseline files** and **51 final-code files** were verified to have exactly the same Git blob hashes as the locally tested snapshots. Original local commit IDs and the mapping are recorded in `docs/publication.json`; GitHub version refs above are the submission refs. No fabricated test rerun on the remote server is claimed.

## Report, evidence and limitations
Read `docs/analysis.md`, module diagrams (`docs/before.mmd`, `docs/after.mmd`), `docs/ai-evidence.md` and `docs/reflection.md`. PDF: `docs/Assignment04_Zhaulybek_Sayat.pdf`. Reflection is a 200-300-word student-review draft: no personal verification is invented. `evidence/metrics.json` explains the narrow duplicate-block metric and counts.

One fictional day, no persistence by design; no cross-browser device matrix; no coverage/complexity percentage. Source access note: Lesson07 Practice was mentioned in the earlier chat but its PDF was unavailable here; it is not cited as directly read. The assignment, Lesson07 lecture, Lesson08 lecture/practice and local Practice06 baseline material were inspected.

**No ZIP submission.** The repository is published under Sayatikus. See `SUBMISSION.md` for the PDF and version links to include in the submission email. No email has been sent.
