# Verification summary - 2026-11-08 Asia/Almaty
- Baseline: actual node --test tests/booking.test.mjs run before source edits: 18/18 passed.
- After first implementation: 18/18 original regressions; typecheck passed; first lint found one warning; build passed. First/intermediate logs retained.
- Final code after dependency removal and formatting: npm test 33/33; typecheck/lint/build all exit 0; git diff --check exit 0.
- Standalone Playwright: process launch failed; 0 scenarios executed; failure retained in final-ui.txt.
- Connected Chrome: 18 actual assertions passed using cua_repl locators/evaluate; saved browser-connector-ui.txt and screenshots. This does not imply standalone Playwright passed.
- PDF: 10 pages rendered using PyMuPDF, contact sheet plus enlarged pages visually inspected. No replacement glyphs found in extracted text; layout has no clipping or overflow.
- Lesson07 Practice not accessible; no direct-content claim made.
- GitHub publication completed under Sayatikus after user sign-in. Baseline 03d7cd408213e0d365785e858171821b331eda14: 25/25 file hashes match the tested baseline; final code 55c66603b947e01480ece2c2385ffbe9c66c4610: 51/51 match the tested final-code snapshot. Published branch refs are recorded in docs/publication.json. No email sent.
