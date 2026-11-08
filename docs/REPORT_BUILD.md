# Rebuild the report
The submitted PDF was rendered and visually checked on all ten pages.
The report generator is optional; it is not needed to run the app.

Install Python reportlab and Pillow, then from the repository run:

```sh
python3 scripts/build_report.py
```

It uses existing evidence screenshots, metrics and the published commit references in docs/publication.json.
Use the original evidence files to preserve the recorded results; do not change the numbers without rerunning checks. Rendering for review used PyMuPDF; page PNGs were inspected separately from text extraction.
