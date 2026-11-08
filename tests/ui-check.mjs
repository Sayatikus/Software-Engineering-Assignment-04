import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL} : {});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror', e => errors.push(e.message));
await mkdir('evidence/screenshots',{recursive:true});
let passed=0;
async function check(name, fn) { await fn(); passed++; console.log(`PASS UI${passed}: ${name}`); }
const room=id=>page.getByTestId(`room-${id}`);
const result=page.getByTestId('availability-result');
try {
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:5173');
  await page.getByRole('heading',{name:'Find a room for your next session'}).waitFor();
  await check('six room cards render', async()=>assert.equal(await page.locator('[data-testid^="room-"]').count(),6));
  await check('F1 exact 40 seats includes Newton and hides Turing',async()=>{
    await page.getByLabel('Attendees (minimum capacity)').fill('40');
    await room('r2').waitFor(); assert.equal(await room('r5').count(),0);
  });
  await check('F2 all equipment filters combined',async()=>{
    await page.getByLabel('Attendees (minimum capacity)').fill('35');
    await page.getByRole('checkbox',{name:'Projector',exact:true}).check();
    await page.getByRole('checkbox',{name:'Computers',exact:true}).check();
    assert.equal(await page.locator('[data-testid^="room-"]').count(),1);
    await room('r5').waitFor();
    await page.screenshot({path:'evidence/screenshots/filter-success.png',fullPage:true});
  });
  await check('F4 empty state and invalid attendee feedback',async()=>{
    await page.getByLabel('Attendees (minimum capacity)').fill('201');
    await page.getByText('No rooms match your requirements.',{exact:false}).waitFor();
    assert.equal(await page.locator('[data-testid^="room-"]').count(),0);
    await page.screenshot({path:'evidence/screenshots/filter-empty.png',fullPage:true});
    await page.getByLabel('Attendees (minimum capacity)').fill('0');
    await page.getByRole('alert').waitFor();
  });
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await check('AC4 overlap gives explicit rejection',async()=>{
    await room('r1').click(); await page.getByRole('button',{name:'Check Availability',exact:true}).click();
    await result.getByText('Unavailable',{exact:true}).waitFor();
    assert.match(await result.innerText(),/Overlaps/);
  });
  await check('F5 switching room immediately refreshes to available using its own schedule',async()=>{
    await room('r5').click(); await result.getByText('Available',{exact:true}).waitFor();
    assert.match(await result.innerText(),/Turing/);
    await page.screenshot({path:'evidence/screenshots/desktop-available.png',fullPage:true});
  });
  await check('F5 switched blocked room cannot retain available result',async()=>{
    await room('r3').click(); await result.getByText('Unavailable',{exact:true}).waitFor();
    assert.match(await result.innerText(),/blocked/);
    await page.screenshot({path:'evidence/screenshots/blocked.png',fullPage:true});
  });
  await check('filter changes clear hidden selection and old result',async()=>{
    await page.getByLabel('Attendees (minimum capacity)').fill('100');
    assert.equal(await page.locator('[aria-pressed="true"]').count(),0);
    assert.equal(await result.getByText('Unavailable',{exact:true}).count(),0);
    await page.getByRole('button',{name:'Check Availability',exact:true}).click();
    assert.match(await result.innerText(),/Please select a room/);
  });
  await page.getByRole('button',{name:'Reset',exact:true}).click(); await room('r5').click();
  await check('AC1 malformed time and AC2 121 minutes update feedback',async()=>{
    await page.getByLabel('Start',{exact:true}).fill('xx');
    await page.getByRole('button',{name:'Check Availability',exact:true}).click();
    assert.match(await result.innerText(),/valid times/);
    await page.getByLabel('Start',{exact:true}).fill('10:00');
    await page.getByLabel('End',{exact:true}).fill('12:01');
    assert.match(await result.innerText(),/120 minutes/);
  });
  await check('AC1 24:00 end is accepted',async()=>{
    await page.getByLabel('Start',{exact:true}).fill('23:00');
    await page.getByLabel('End',{exact:true}).fill('24:00');
    await result.getByText('Available',{exact:true}).waitFor();
  });
  await check('AC6 mobile 390px no page overflow and checker works',async()=>{
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'Reset',exact:true}).click();
    await room('r5').click(); await page.getByRole('button',{name:'Check Availability',exact:true}).click();
    await result.getByText('Available',{exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),true);
    await page.screenshot({path:'evidence/screenshots/mobile-390.png',fullPage:true});
    await page.setViewportSize({width:320,height:800});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),true);
  });
  await check('AC5 repeated checks keep displayed bookings unchanged',async()=>{
    const section=page.getByRole('heading',{name:'Existing bookings - Turing Computer Lab'}).locator('..');
    const before=await section.innerText();
    await page.getByRole('button',{name:'Check Availability',exact:true}).click();
    assert.equal(await section.innerText(),before);
  });
  assert.deepEqual(errors,[]);
  console.log(`UI SUMMARY: ${passed}/${passed} passed; no browser runtime errors.`);
} finally { await browser.close(); }
