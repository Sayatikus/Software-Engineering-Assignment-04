# Assignment 04 - analysis and evolution record
Zhaulybek Sayat | 24B031037 | Friday 14:00-17:00 | 8 November 2026

## Provenance and baseline
The source is the existing local Smart Campus export in `tmp/practice08/baseline/project`, originally exported for Practice 06 and reused for Practice 08. This is a working six-room prototype, not a manufactured one-room baseline. It already had AC1-AC5 booking logic, responsive presentation and 18 regression tests, but no equipment fields or capacity/equipment filters. It was copied without build artifacts or installed dependencies. The first commit adds only ignore rules and the actual baseline test output to the imported code. The original project is untouched.

Published repository: https://github.com/Sayatikus/Software-Engineering-Assignment-04

Published baseline branch `baseline-a04`: `03d7cd408213e0d365785e858171821b331eda14`.
Published final-code branch `final-code-a04`: `55c66603b947e01480ece2c2385ffbe9c66c4610`.
The `main` branch adds this report and documentation. Original local tags remain in the local history; browser upload commits differ in IDs but all 25 baseline and 51 final-code blobs were verified identical to the tested local snapshots. `docs/publication.json` maps both histories.

## Task 1 - structured context and three risks
The context supplied to Codex was: React/TypeScript/Vite; App composes RoomCard, ResultPanel and Timeline; sampleData contains six fictional rooms and their booking associations; bookingLogic contains validation, overlap, parsing and formatting; existing tests specify AC1-AC5. New work must satisfy F1-F5, keep a fixed time, avoid login/database/APIs, and preserve non-mutation. The initial priority plan was recorded in conversation before implementation: save/run baseline, add equipment and filters, separate responsibilities and refresh selection, then verify and document.

| Priority | Grounded maintainability risk | Evidence at baseline | Decision and verification |
|---|---|---|---|
| P1 | App mixes form presentation, UI state, result lifecycle and booking-list rendering | `src/App.tsx`, `App`, `handleCheck`, `TimeField`, inline booking table | Extract TimeForm, RoomFilters, BookingList; compute result from current state. F5 integration and browser checks validate room switching. |
| P2 | Repeated parsing/validation invites inconsistent feedback | `src/App.tsx`: parsedStart/parsedEnd/parsedCurrent followed by `timeInputsValid`, plus `durationLabel`; `bookingLogic.ts` also owns time helpers | Remove redundant timeInputsValid block, extract time.ts and selection.ts. AC1 parser and 24:00 checks guard behavior. No claim of three independent parser implementations. |
| P3 | Unused backend dependency suggests unsupported persistence and adds upgrade work | `package.json` declares `@supabase/supabase-js`; no source imports it | Remove unused dependency and its lockfile entries. Build/typecheck/lint and all tests rerun after removal. No backend was introduced. |

Implementation order: baseline 18/18 -> catalog/filter adapter and UI separation -> original tests 18/18 -> expanded suite 33/33 -> connected browser checks -> dependency cleanup/formatting -> final tests/typecheck/lint/build. This is the actual sequence; not a claim that every edit was individually committed.

### Rejected AI design option
AI-generated option considered during this run: preserve `useState<CheckResult>` and add manual reset/recompute calls in every room, filter and time handler. Decision: reject this option and keep only a `checked` flag; derive the decision with `evaluateSelection` on render. It avoids stale results and repeated lifecycle logic. Filter handlers also clear the selected ID. This was Codex self-review, not an invented second-model transcript or a claimed student decision. The student must review the decision before presenting it as personal work.

## Task 2 - feature extension and behavior
Each room has ID, name, building, capacity, equipment and blocked status. Bookings are separate fixtures associated by roomId; the original checker explicitly selects only bookings with the chosen room ID.

| ID | Fictional room | Capacity | Equipment | Blocked |
|---|---|---:|---|---|
| r1 | Athena Lecture Hall | 120 | Projector, Whiteboard | No |
| r2 | Newton Lab 201 | 40 | Whiteboard, Computers | No |
| r3 | Curie Seminar Room | 20 | Projector, Whiteboard | Yes |
| r4 | Da Vinci Auditorium | 200 | Projector, Microphone | No |
| r5 | Turing Computer Lab | 35 | Computers, Projector, Whiteboard | No |
| r6 | Plato Discussion Room | 16 | Whiteboard | Yes |

F1 uses `capacity >= attendees`; only positive whole-number attendees are accepted. F2 uses `required.every(...)`, not OR. F3 keeps blocked rooms visible if their facilities match, but never available. F4 explains that attendees/equipment should be relaxed when no rooms match. F5 recalculates a checked result immediately on room/time changes; filter changes clear hidden selection and the old result. A new explicit check without a selected room returns Unavailable with a selection reason.

Demonstrations: 35 attendees + Projector + Computers -> only Turing; 201 attendees -> no rooms. With fixed now 09:00 and 10:00-11:00, Athena overlaps Intro to Physics while Turing is available. Switching to Curie gives blocked feedback. Existing bookings are displayed for the same room and never saved or mutated.

## Task 3 - refactoring
See `before.mmd`, `after.mmd` and the PDF module diagrams. Baseline: App coordinates sampleData and bookingLogic and embeds TimeField and booking table. Final: App coordinates separate filters, form and booking-list presentation; selection.ts bridges UI strings/catalog to pure rules. bookingLogic retains the original function signature so unchanged regression tests run on both versions; fmt/parseTime are re-exported for compatibility.

Design decision 1: keep filter logic pure and independent of React. Exact-capacity and ALL-equipment tests use explicit expected room IDs, so business rules can be verified without a browser.

Design decision 2: derive checked availability from current inputs. This removes stale result state and makes F5 an ordinary consequence of rendering; the browser test switches from unavailable Athena to available Turing without pressing Check again.

Design decision 3: preserve original booking associations and rule API. No migration or database is needed; `checkAvailability` filters by roomId and does not mutate its input. Frozen fixture tests check both available and unavailable paths.

## Task 4 - tests and actual execution
Environment: Node v24.13.1, npm 11.8.0, Vite 5.4.8, macOS, fixed fictional current time 09:00. Node >=22.18 is required for direct TypeScript imports in the test runner.

| Evidence | Command / method | Actual outcome |
|---|---|---|
| evidence/baseline-tests.txt | node --test tests/booking.test.mjs at baseline | 18/18 passed |
| evidence/final-tests.txt | npm test | 33/33 passed (18 unchanged regression + 15 catalog/integration/robustness tests) |
| evidence/final-typecheck.txt | npm run typecheck | Exit 0 |
| evidence/final-lint.txt | npm run lint | Exit 0; no final lint warnings |
| evidence/final-build.txt | npm run build | Exit 0; outdated Browserslist data warning retained |
| evidence/diff-check.txt | git diff --check | Exit 0 |
| evidence/browser-connector-ui.txt | Connected Chrome assertions through cua_repl | 18/18 assertions passed; real screenshots saved |
| evidence/final-ui.txt | PLAYWRIGHT_CHANNEL=chrome npm run test:ui | Failed at browser process launch (SIGABRT/EPERM); 0 UI cases executed in this command |

The connected-browser assertions and standalone script are different execution paths and are reported separately. The 18 assertions are not added to the 33 Node test total. A portable 12-scenario Playwright script is supplied for rerunning outside this desktop restriction; it is not claimed to have passed here. No statement of browser matrix coverage, code coverage percentage, performance improvement or user manual verification is made.

Coverage: T02-T05/T17-T18 validate time; T06/T07 distinguish exactly 120 and 121 minutes; T13 blocked rooms; T01/T08 endpoint-touch and T09-T12 overlaps; T15 immutable order and contents. Catalog tests cover 40 vs 41 attendees, ALL equipment, impossible filters, hidden selection, different rooms' schedules, invalid time input, nonfinite values and frozen data. Browser checks confirm the F4 empty message, F5 immediate refresh, invalid attendees, AC6 no page overflow at 390/320 px and repeated check non-mutation.

## Task 5 - quality comparison
| Measure | Baseline | Final | Measurement / interpretation |
|---|---:|---:|---|
| Original regression tests | 18/18 | 18/18 | Same unmodified booking.test.mjs on both versions |
| Complete Node suite | 18/18 | 33/33 | Actual terminal summaries; final suite has 15 extra cases, not a controlled speed comparison |
| Redundant validation blocks | 1 | 0 | Manual diff: remove timeInputsValid block that reparsed all 3 already-parsed fields; 1 duplicate location removed |
| UI .tsx modules excluding main.tsx | 4 | 7 | Count paths: App plus 3 original / 6 final components; not a complexity score |
| src/lib modules | 3 | 6 | Data, types, rules -> add time, filtering, selection adapter |
| App physical lines | 270 | 141 | Count splitlines; formatting affects this, so line count alone is not evidence of quality |
| Room catalog | 6, no equipment filters | 6, capacity and equipment filters | Existing rooms retained and extended, not claimed as 1 -> 6 |

Remaining limitations: one fictional day, no persistence by design; no multi-browser/mobile-device matrix; standalone UI runner blocked in this environment; no automated coverage/complexity benchmark; no independent student review has yet been confirmed. A 390px and 320px browser viewport is responsive evidence, not proof of native phone compatibility.

## Task 6 - reflection
See `reflection.md` (200-300 words). It is explicitly a draft for student review. The record distinguishes AI-executed checks from personal verification; no review by Zhaulybek Sayat is fabricated.

## Grounding and references
1. Lesson #08 - Software Engineering - Assignment #04.pdf, 32 pages: pp. 9-13 scope, AC1-AC6 and F1-F5; pp. 14-19 six tasks; pp. 25-29 AI record, deliverables, recipient and deadline.
2. Lesson #07 - Software Engineering - Lecture.pdf, 59 pages: pp. 8-9 structured context/onboarding; p. 15 ReAct observe/act/adapt; p. 18 human-in-the-loop. Applied through repository map, bounded changes, actual tool feedback and explicit student-review boundary.
3. Lesson #08 - Software Engineering - Lecture.pdf, 68 pages: pp. 9-14 coding-agent tool loop and progressively loaded skills. Used existing PDF skill for artifact verification; no new assignment skill created.
4. Lesson #08 - Software Engineering - Practice.pdf, 35 pages: p. 8 AC repair contract; p. 9 reproduce/localize/explain/patch/verify; p. 28 actual regression output. Applied through saved baseline, fixed fixtures, unchanged regressions and truthful logs.
5. Local file `Lesson 06 - Software Engineering - Practice 7.pdf` actually identifies itself as Practice #06 (25 pages), pp. 8-9 Smart Campus scope/AC and p. 21 retesting. Used as baseline context, not misrepresented as Lesson #07 Practice.
6. The separate Lesson #07 Practice (Testing AI-Generated Code, described in the earlier chat as 28 pages) was not accessible in the uploaded-file cache or local Downloads. Its contents are NOT cited as directly read. The assignment and Practice #08 explicitly provide the test contract used here. This source-access limitation is disclosed rather than invented.

## Submission status
No ZIP is provided. The source, baseline/final branches, logs, diagrams and PDF are published at https://github.com/Sayatikus/Software-Engineering-Assignment-04. The user signed into GitHub as Sayatikus; publication used normal browser upload controls and created no additional credential. The old Practice08 repository was left unchanged. Original local source/history remains available, with exact published-file equivalence recorded in evidence/publication-verification.json. No email has been sent. See SUBMISSION.md for the submission links and recipient.
