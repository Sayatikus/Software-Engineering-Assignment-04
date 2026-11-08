from pathlib import Path
import json,subprocess,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,Image,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing,Rect,String,Line,Polygon
from reportlab.graphics import renderSVG
r=Path(__file__).resolve().parents[1]; out=r/'docs/Assignment04_Zhaulybek_Sayat.pdf'
m=json.loads((r/'evidence/metrics.json').read_text()); publication=json.loads((r/'docs/publication.json').read_text()); base=publication['published_baseline_ref']; final=publication['published_final_code_ref']
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='StudentTitle',fontName='Helvetica-Bold',fontSize=23,leading=29,spaceAfter=16))
styles.add(ParagraphStyle(name='StudentBody',fontName='Helvetica',fontSize=10.3,leading=14.5,spaceAfter=9))
styles.add(ParagraphStyle(name='StudentSmall',fontName='Helvetica',fontSize=8.6,leading=11.8,spaceAfter=6))
styles.add(ParagraphStyle(name='StudentHeading',fontName='Helvetica-Bold',fontSize=15,leading=19,spaceAfter=13))
styles.add(ParagraphStyle(name='StudentSub',fontName='Helvetica-Bold',fontSize=11.2,leading=15,spaceBefore=8,spaceAfter=7))
styles.add(ParagraphStyle(name='StudentCode',fontName='Courier',fontSize=8.2,leading=12,spaceAfter=9))
story=[]
def p(t,style='StudentBody'):return Paragraph(t,styles[style])
def add(t,style='StudentBody'):story.append(p(t,style))
def title(t):add(t,'StudentHeading')
def sub(t):add(t,'StudentSub')
def page():story.append(PageBreak())
def table(rows,widths,small=True):
 data=[[p(html.escape(str(x)).replace('\n','<br/>'),'StudentSmall' if small else 'StudentBody') for x in row] for row in rows]
 t=Table(data,colWidths=widths,hAlign='LEFT',repeatRows=1)
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9edf1')),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),0.4,colors.HexColor('#c4cbd2')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
 story.append(t);story.append(Spacer(1,10))
def photo(name,w,h=None):
 from PIL import Image as PIL
 path=r/'evidence/screenshots'/name
 iw,ih=PIL.open(path).size
 return Image(str(path),width=w,height=h or w*ih/iw)
def diagram(after=False):
 h=235 if after else 155; d=Drawing(495,h)
 def box(x,y,w,hh,lines):
  d.add(Rect(x,y,w,hh,fillColor=colors.HexColor('#f1f4f7'),strokeColor=colors.HexColor('#7c8b99'),strokeWidth=.7))
  for i,s in enumerate(lines):d.add(String(x+w/2,y+hh-15-i*12,s,textAnchor='middle',fontName='Helvetica',fontSize=8.4,fillColor=colors.HexColor('#202830')))
 def arrow(x1,y1,x2,y2):
  d.add(Line(x1,y1,x2,y2,strokeColor=colors.HexColor('#7c8b99'),strokeWidth=.8))
  # final 4pt arrowhead; routing in these diagrams is vertical
  d.add(Polygon([x2,y2,x2-3,y2+5,x2+3,y2+5],fillColor=colors.HexColor('#7c8b99'),strokeColor=None))
 if not after:
  box(75,107,345,43,['App.tsx: state, form, stored result, booking table','TimeField and repeated parsing inside App'])
  for x,w,label in [(0,150,['RoomCard / Timeline','ResultPanel']),(171,150,['sampleData.ts','rooms + bookings']),(342,153,['bookingLogic.ts','rules + time helpers'])]:
   box(x,25,w,48,label);arrow(247,107,x+w/2,73)
  d.add(String(247,5,'types.ts supplies Room, Booking and CheckResult contracts',textAnchor='middle',fontSize=8.4))
 else:
  box(85,188,325,42,['App.tsx: input state and composition','derived result; no stale CheckResult state'])
  box(0,110,155,47,['Presentation (6 components)','filters, form, cards, result,','timeline and booking list'])
  box(172,110,150,47,['selection.ts','selected room + text times','fixed 09:00 adapter'])
  box(339,110,156,47,['sampleData.ts','fictional rooms + bookings','joined by roomId'])
  for x in [77,247,417]:arrow(247,188,x,157)
  box(0,22,155,47,['roomFilters.ts','capacity >= attendees','ALL equipment via every'])
  box(172,22,150,47,['bookingLogic.ts','original AC1-AC5 rules','room-specific overlap'])
  box(339,22,156,47,['time.ts','strict HH:MM parser','formatter; 24:00 end'])
  for x in [77,247,417]:arrow(247,110,x,69)
  d.add(String(247,3,'types.ts: shared contracts; bookingLogic re-exports time helpers for compatibility',textAnchor='middle',fontSize=8))
 renderSVG.drawToFile(d,str(r/'docs'/('after.svg' if after else 'before.svg')))
 return d
# 1
add('Software Engineering<br/>Assignment #04','StudentTitle')
add('AI-assisted software evolution, refactoring and quality improvement','StudentHeading')
table([['Student','Details'],['Full name','Zhaulybek Sayat'],['Student ID','24B031037'],['Class','Friday 14:00-17:00'],['Date','8 November 2026'],['Application','Smart Campus Room Availability Checker']], [115,380],False)
sub('What was delivered')
add('The existing Smart Campus prototype was extended with minimum-capacity and ALL-required-equipment filters. Six fictional rooms, room-specific bookings and the original availability rules are retained. The interface uses a fixed current time of 09:00 and never creates a booking.')
add('<b>Evidence:</b> 33/33 Node tests passed; the original 18 regression tests remain unchanged. Type checking, linting and production build exited successfully. A separate connected-Chrome check passed 18 assertions, including mobile widths of 390 and 320 pixels.')
sub('Version references')
add('Published baseline branch: <b>baseline-a04</b><br/>'+base+'<br/>Published final application branch: <b>final-code-a04</b><br/>'+final,'StudentSmall')
add('The <b>main</b> branch adds this PDF and documentation. The actual six-room baseline and final code are preserved in separate published branches. All 25 baseline and 51 final-code file hashes match the locally tested snapshots; upload-created commit IDs differ from the original local IDs.','StudentSmall')
sub('Submission status')
add('The source, tests, logs and this PDF are published without ZIP at:<br/><link href="https://github.com/Sayatikus/Software-Engineering-Assignment-04">https://github.com/Sayatikus/Software-Engineering-Assignment-04</link><br/>Baseline and final-code branches are preserved. SUBMISSION.md contains the exact links and email details. No email has been sent.','StudentSmall')
# 2
page();title('1. Codebase analysis and priority plan')
add('Before editing, Codex received the repository map, AC1-AC6, F1-F5 and constraints: React/TypeScript/Vite, fictional fixtures, no login/database/live APIs, fixed clock and immutable booking data. The baseline was saved and its 18 tests were actually run.')
table([['Risk and reference','Why it matters','Action'],['P1 - src/App.tsx: App, handleCheck, TimeField and inline booking table','Form layout, result lifecycle and booking presentation change together. Stored results can become stale after input changes.','Extract TimeForm, RoomFilters and BookingList. Derive the result from current state.'],['P2 - App parsedStart/parsedEnd/parsedCurrent and timeInputsValid; durationLabel; bookingLogic time helpers','The same time strings are parsed repeatedly in different UI locations. Changes can produce inconsistent feedback.','Remove redundant validation block. Separate time helpers and the selection adapter; retain the original rules API.'],['P3 - package.json: @supabase/supabase-js','The dependency has no source imports and suggests an unsupported backend. It adds avoidable maintenance work.','Remove the dependency and its lockfile entries. Rerun checks after removal.']], [152,176,167])
sub('Plan recorded before implementation')
add('1. Preserve the working export and establish regression evidence.<br/>2. Add room equipment and pure capacity/equipment filtering.<br/>3. Separate presentation and selection logic; keep AC1-AC6 and refresh results.<br/>4. Run boundary, integration and browser checks; review differences and document limitations.')
sub('Rejected AI recommendation')
add('An AI design option was to keep a stored CheckResult and add manual reset/recompute calls to every room, filter and time handler. This was rejected during Codex self-review. The final version stores only whether Check was requested and derives the decision from current inputs. Room switching therefore refreshes the result automatically; filter changes clear hidden selections.')
add('This is a documented AI self-review decision. No separate model conversation or personal student approval is invented. The student should review and explain it before submission.','StudentSmall')
# 3
page();title('2. Feature extension and preserved behavior')
table([['ID / fictional room','Seats','Equipment','Blocked'],['r1 Athena Lecture Hall','120','Projector, Whiteboard','No'],['r2 Newton Lab 201','40','Whiteboard, Computers','No'],['r3 Curie Seminar Room','20','Projector, Whiteboard','Yes'],['r4 Da Vinci Auditorium','200','Projector, Microphone','No'],['r5 Turing Computer Lab','35','Computers, Projector, Whiteboard','No'],['r6 Plato Discussion Room','16','Whiteboard','Yes']], [157,43,240,55])
add('Every room includes ID, name, building, capacity, equipment and blocked status. Separate bookings reference roomId. checkAvailability selects only bookings belonging to the chosen room; no global schedule is applied to every room.')
table([['Rule','Implementation and observable result'],['F1 - minimum capacity','capacity >= attendees. Exactly 40 includes Newton; 41 excludes it. Invalid, zero and fractional attendees show feedback/no matches.'],['F2 - all equipment','required.every(item => room.equipment.includes(item)). 35 + Projector + Computers leaves only Turing.'],['F3 - blocked room','Blocked facilities may match filters but the availability decision is always Unavailable. Curie demonstrates this.'],['F4 - no matches','201 attendees produces an explicit empty state suggesting fewer attendees or less required equipment.'],['F5 - refresh result','After checking Athena at 10:00-11:00, switching to Turing immediately changes Unavailable to Available. Switching to Curie gives blocked feedback.']], [115,380])
sub('AC1-AC6 remain the contract')
add('AC1: 0 <= start < end <= 1440 and start is after 09:00. AC2: maximum 120 minutes. AC3: blocked rooms rejected. AC4: strict overlap is start &lt; booking.end AND booking.start &lt; end; touching endpoints are allowed. AC5: show a decision without changing bookings. AC6: understandable messages and usable desktop/narrow layouts.')
add('The UI permits 24:00 as an end time. A 24:00 start cannot satisfy start &lt; end within the same day. All data is fictional, and the application is an availability checker rather than a booking confirmation service.','StudentSmall')
# 4
page();title('3. Before and after module diagrams')
sub('Before - baseline-a04');story.append(diagram(False));story.append(Spacer(1,9))
sub('After - final-code-a04');story.append(diagram(True));story.append(Spacer(1,10))
add('<b>Decision 1 - pure rules:</b> capacity/equipment filtering is independent of React. Tests assert explicit room IDs without needing a browser, and equipment uses AND semantics.')
add('<b>Decision 2 - derived results:</b> evaluateSelection adapts current input strings and the chosen matching room to the original checker. This eliminates stale saved results and makes F5 directly testable.')
add('<b>Decision 3 - compatibility:</b> checkAvailability keeps its original signature and roomId guard. Existing regression tests run unchanged; bookingLogic re-exports time helpers so retained components continue working. Mermaid and SVG versions of these diagrams are supplied in docs/.','StudentSmall')
# 5
page();title('4. Automated tests and actual terminal evidence')
add('Environment: Node 24.13.1, npm 11.8.0, Vite 5.4.8, macOS. Tests use fixed fixtures and 09:00, so outcomes do not depend on the real date. Node >=22.18 is required for direct TypeScript test imports.')
table([['Command / evidence file','Actual result'],['node --test tests/booking.test.mjs (baseline)','18 tests, 18 passed, 0 failed'],['npm test / final-tests.txt','33 tests, 33 passed, 0 failed'],['npm run typecheck / final-typecheck.txt','Exit 0'],['npm run lint / final-lint.txt','Exit 0; no final lint warnings'],['npm run build / final-build.txt','Exit 0; old Browserslist dataset warning retained'],['git diff --check / diff-check.txt','Exit 0'],['Connected Chrome / browser-connector-ui.txt','18/18 real assertions passed; separate from Node total'],['PLAYWRIGHT_CHANNEL=chrome npm run test:ui','Launch failed before cases: SIGABRT/EPERM. 0 UI cases executed by this command.']], [287,208])
sub('Coverage of required boundaries')
table([['Requirement / cases','Independent expected result'],['AC1: T02-T05, T17-T18 and parser tests','Reject now/past, reversed/zero/invalid intervals; allow end 24:00. Reject NaN, Infinity and fractional minute API input.'],['AC2: T06 / T07','Exactly 120 minutes accepted when free; 121 rejected.'],['AC3/AC4: T13, T01, T08-T12, T14, T16','Blocked rejected; touching before/after allowed; partial, containing, inside and identical overlap rejected; other-room booking ignored.'],['AC5: T15 and frozen data test','Both order and contents unchanged; frozen rooms/equipment/bookings survive checks.'],['F1-F4: catalog tests','40 vs 41 attendees, all selected equipment, combined filters, unknown equipment and empty state.'],['F5: integration + browser assertions','Same interval returns different decisions for Athena and Turing; hidden/unknown room never available.']], [188,307])
add('The terminal log files contain complete actual output and exit codes. The portable Playwright script contains 12 scenarios but is not claimed to have passed here. Connected Chrome provided the actual UI verification. No code coverage percentage or performance improvement is claimed.','StudentSmall')
# 6
page();title('UI evidence - successful filtering and availability')
add('Actual connected-Chrome captures from the running local application, 8 November 2026. These are screenshots, not mockups. Captions describe the exact tested inputs.','StudentSmall')
story.append(photo('filter-success.jpg',495));add('Figure 1. 35 attendees plus Projector and Computers leaves only Turing Computer Lab. The ALL-equipment and exact-capacity rule both apply.','StudentSmall')
story.append(Spacer(1,8));story.append(photo('desktop-available.jpg',495));add('Figure 2. After checking Athena at 10:00-11:00 (overlap), switching to Turing immediately shows Available and its own schedule. No additional Check action is needed for the refresh.','StudentSmall')
# 7
page();title('UI evidence - empty result and mobile feedback')
add('F4 was checked with an impossible capacity, and AC6 was checked using real browser viewports rather than a phone-shaped mockup.','StudentSmall')
left=[photo('filter-empty.jpg',280),p('Figure 3. 201 attendees produces zero matching rooms and a clear suggestion to relax requirements.','StudentSmall'),Spacer(1,10),p('Mobile verification','StudentSub'),p('At 390px, the form, Available decision, selected-room schedule and booking list remain usable. At 320px, the automated connector assertion also confirmed no horizontal page overflow.','StudentBody'),p('The screenshot on the right is the lower part of the real 390px page, scrolled to the result. The full-height capture is also retained in evidence/screenshots/mobile-390.jpg.','StudentSmall'),p('The check is read-only. Repeating it preserves the displayed bookings, while a frozen-fixture Node test verifies data contents and order.','StudentSmall')]
right=[photo('mobile-result.jpg',185),p('Figure 4. Real 390px viewport.','StudentSmall')]
t=Table([[left,right]],colWidths=[300,195]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),10)]));story.append(t)
sub('Blocked room evidence')
add('Curie Seminar Room has no schedule conflicts in the selected interval but is blocked. The connected-browser assertion confirmed an Unavailable result with the blocked reason after switching from Turing. The actual capture is retained as blocked.jpg; the result never carries over as Available.')
# 8
page();title('5. Quality comparison and remaining limitations')
table([['Measure','Baseline','Final','How measured'],['Original regression tests','18/18','18/18','Same unchanged booking.test.mjs on both versions.'],['All Node tests','18/18','33/33','Actual runner summaries; final adds 15 tests.'],['Redundant validation blocks','1','0','Manual diff removes timeInputsValid block, which reparsed the same 3 fields. One duplicate location removed.'],['UI modules (exclude main.tsx)','4','7','App + 3 original / 6 final component files.'],['src/lib modules','3','6','Count source paths: add time, filtering and selection adapter.'],['App physical lines','270','141','splitlines count. Formatting affects this; it is not a complexity score.'],['Rooms and filtering','6, no equipment filters','6, capacity + equipment','Inspect actual catalog and executed F1/F2 tests.']], [148,62,90,195])
sub('Interpretation')
add('The baseline was already working, so no false failing-baseline claim is needed. The improvement is new tested behavior and clearer responsibility boundaries while all original regressions stay green. More modules alone do not prove better quality; the meaningful evidence is that rules can be tested independently and switching rooms uses current input without stale result state.')
add('The duplication metric is deliberately narrow: one redundant UI validation block removed. It is based on a manual source comparison, not a code-clone detector, maintainability index or percentage reduction across the whole repository.')
sub('Limitations kept visible')
add('One fictional day and a fixed clock are intentional. There is no persistence, login or live room API. The browser evidence covers connected Chrome and two narrow viewport widths; it is not a cross-browser or physical-device matrix. The standalone browser launch failed in this environment, even though separate connector assertions succeeded.')
add('No coverage report, complexity benchmark, speed comparison or independent student verification is available. The production build reports outdated Browserslist data; this warning does not change the recorded exit code. Personal review remains an explicit submission step. The published code was verified byte-for-byte against the tested local snapshots.')
# 9
page();title('6. Personal reflection')
add('253 words. Draft for Zhaulybek Sayat to review before submission; no unperformed personal verification is claimed.','StudentSmall')
reflection=(r/'docs/reflection.md').read_text().split('\n\n',1)[1]
for para in reflection.strip().split('\n\n'):add(html.escape(para))
sub('AI-use declaration')
add('OpenAI Codex desktop (GPT-6 family), used 8 November 2026. The exact backend model/version identifier was not exposed. Codex inspected files, implemented changes and executed checks using terminal and connected-browser tools. The existing PDF skill was used to build and verify this report. No new Agent Skill was created for Assignment #04.')
add('All reported tests are tool-executed evidence. The author should only retain a first-person manual-verification claim after personally repeating the relevant action. This draft keeps that boundary explicit.','StudentSmall')
# 10
page();title('AI evidence appendix and submission details')
table([['Selected input / output','Decision / verification'],['User request: continue Smart Campus; retain AC1-AC6; implement F1-F5; no ZIP; genuine evidence.','Read assignment and available lecture/practice PDFs. Reuse actual local export; preserve baseline commit and 18-test output.'],['Pre-edit plan: save baseline, add filters, separate responsibilities, then verify.','Implemented pure filter and selection adapter, extracted form/filter/list components. Unchanged regressions remained green.'],['AI option: keep stored result and reset/recompute in every event handler.','Rejected during AI self-review. Derived result chosen; F5 integration/browser switching verifies it.'],['Problem: standalone Playwright launch aborted; first lint had a component-export warning.','Failure retained; actual UI checked through connected Chrome. Unnecessary export removed, final lint rerun successfully.'],['Generated claims checked against evidence.','33/33 Node results, 18 connector assertions, frozen fixture checks, exact capacity/ALL equipment, real screenshots. No invented human approval.']], [245,250])
sub('Sources used directly')
add('Assignment #04 (32 pp.): pp. 9-13 scope/criteria; pp. 14-19 six tasks; pp. 25-29 evidence, submission and deadline.<br/>Lesson #07 Lecture (59 pp.): pp. 8-9 structured context; p. 15 iterative tool loop; p. 18 human review.<br/>Lesson #08 Lecture (68 pp.): pp. 9-14 agent tools and existing skills.<br/>Lesson #08 Practice (35 pp.): p. 8 AC contract; p. 9 debugging workflow; p. 28 real regression output.<br/>Local file named Practice 7 actually identifies itself as Practice #06 (25 pp.): pp. 8-9 Smart Campus AC; p. 21 retest.','StudentSmall')
add('<b>Source-access limitation:</b> the separate Lesson #07 Practice PDF mentioned in the earlier chat was not accessible. Its contents are not claimed as directly read. The inspected assignment and Practice #08 provide the implemented test contract. Source file hashes are included in evidence/source-hashes.json.','StudentSmall')
sub('How to submit without ZIP')
add('The separate repository is published under Sayatikus:<br/><link href="https://github.com/Sayatikus/Software-Engineering-Assignment-04">https://github.com/Sayatikus/Software-Engineering-Assignment-04</link><br/>Use its baseline-a04 and final-code-a04 branches for the initial/final sources; main includes the report. All 25 baseline and 51 final-code file hashes match the tested local versions. Attach this PDF and include the repository and version links in the email.')
add('<b>To:</b> kibo.kz.contact.01@gmail.com<br/><b>Subject:</b> Software Engineering - Assignment #04 - Zhaulybek Sayat<br/><b>Deadline:</b> 8 November 2026, 23:59:59 Asia/Almaty. No email has been sent.','StudentSmall')
def footer(c,doc):
 c.setStrokeColor(colors.HexColor('#c5cbd0'));c.line(50,39,545,39)
 c.setFont('Helvetica',8);c.setFillColor(colors.HexColor('#55616b'));c.drawString(50,26,'Zhaulybek Sayat | 24B031037 | Software Engineering - Assignment #04');c.drawRightString(545,26,str(doc.page))
doc=SimpleDocTemplate(str(out),pagesize=(595.28,841.89),rightMargin=50,leftMargin=50,topMargin=45,bottomMargin=50,title='Software Engineering Assignment 04 - Zhaulybek Sayat',author='Zhaulybek Sayat')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(out)
