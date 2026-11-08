# AI evidence appendix - 8 November 2026 (Asia/Almaty)

Tool: OpenAI Codex desktop, GPT-6 family. Exact backend model/version identifier is not exposed in this run. No model version is invented. Used terminal tools, Git, connected Chrome, and the existing PDF skill. No new Agent Skill was created; the optional skills exercise is not claimed.

## Selected inputs and outputs
1. Actual user task (summary, not a verbatim export): complete Assignment04 end-to-end from uploaded assignment/lectures, reuse Smart Campus, retain AC1-AC6, add F1-F5, >=10 executable tests, real logs/diagrams/quality/reflection/AI evidence; no ZIP.
   - Context inspected: read_thread returned assignment attachment; local existing source was found; assignment extracted from all 32 pages; lecture/practice pages inspected directly.
   - Output used: preserve local six-room baseline and its 18 tests rather than reconstructing an artificial one-room starting point.
2. Actual pre-edit assistant plan (selected quotation): "Сначала зафиксирую базовые тесты, затем добавлю фильтры и разделю эти обязанности."
   - Output used: baseline-a04 commit, equipment fixtures, pure filter function, adapter and extracted presentation components.
   - Changes: fixed 09:00 clock; positive-integer attendee validation; equipment.every; derived result refresh; no booking persistence.
3. Generated design alternative considered by Codex during implementation: retain stored CheckResult state and add result-reset/recompute code to every event handler.
   - Decision: rejected in favor of derived evaluateSelection output + checked flag. This is an explicitly documented self-review option, not a fabricated user prompt or separate AI transcript.
   - Verification: Node F5 integration tests; connected Chrome switch Athena -> Turing -> Curie without a new Check action.
4. Actual problem found: standalone Playwright process launch aborted before UI scenarios ran.
   - Output not accepted as evidence: the mere existence of ui-check.mjs.
   - Change in verification: run actual assertions using connected Chrome; preserve failed final-ui.txt and separate browser-connector-ui.txt.
5. Actual cleanup: first lint run warned about exporting EQUIPMENT beside a React component. Removed the unnecessary export; final lint has exit 0 and no warning. Removed unused Supabase dependency after checking the source imports. Final tests/typecheck/lint/build rerun.

## Verification sources
- Assignment pp. 9-19, 25-29: acceptance criteria, tasks and evidence requirements.
- Lesson07 Lecture pp. 8-9, 15, 18: structured context, iterative tool use, human review.
- Lesson08 Lecture pp. 9-14: coding agent tools and existing skills.
- Lesson08 Practice pp. 8-9, 28: boundary/regression checks and actual output.
- Source tests and actual terminal logs in evidence/. Frozen input checks verify non-mutation.
- Real connected Chrome screenshots, including 390px mobile result. Assertions also checked 320px page overflow.

## Human review boundary
All implementation and checks in this session were performed by Codex using tools. No independent manual review by the student is recorded. The first-person reflection is explicitly a review draft. Before submission, the student should inspect the feature, test assertions, rejected option and report and retain only claims they can explain. No invented screenshot, test outcome, second-model output or human approval is included.

## Publication follow-up
The user signed into GitHub as Sayatikus in the in-app browser. Codex created the separate public Assignment04 repository and uploaded the original snapshot before the final snapshot, preserving baseline-a04 and final-code-a04 branches. Public GitHub tree reads verified all 25 baseline and 51 final-code Git blob hashes against the corresponding local tested commits. The report was then updated with actual published refs. No password/token was read or extracted, no new credential was created, and no email was sent.
