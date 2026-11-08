import test from 'node:test';
import assert from 'node:assert/strict';
import { rooms, bookings } from '../src/lib/sampleData.ts';
import { filterRooms } from '../src/lib/roomFilters.ts';
import { evaluateSelection } from '../src/lib/selection.ts';
import { parseTime } from '../src/lib/time.ts';
import { checkAvailability } from '../src/lib/bookingLogic.ts';

const ids = result => result.map(r => r.id);
test('F0 catalog has six fictional rooms with equipment and unique IDs', () => {
  assert.equal(rooms.length, 6);
  assert.equal(new Set(ids(rooms)).size, 6);
  assert.ok(rooms.every(r => r.capacity > 0 && Array.isArray(r.equipment) && typeof r.blocked === 'boolean'));
  assert.ok(bookings.every(b => rooms.some(r => r.id === b.roomId)));
});
test('F1 exact capacity 40 includes Newton; insufficient capacity 41 excludes it', () => {
  assert.deepEqual(ids(filterRooms(rooms, 40, [])), ['r1','r2','r4']);
  assert.deepEqual(ids(filterRooms(rooms, 41, [])), ['r1','r4']);
});
test('F1 invalid attendees reject zero, negative, decimal and NaN', () => {
  for (const n of [0,-1,2.5,NaN]) assert.deepEqual(filterRooms(rooms,n,[]),[]);
});
test('F2 all equipment items required, not just one', () => {
  assert.deepEqual(ids(filterRooms(rooms, 1, ['Projector','Computers'])),['r5']);
});
test('F1/F2 combined filters require capacity and equipment', () => {
  assert.deepEqual(filterRooms(rooms,40,['Computers','Projector']),[]);
});
test('F2 no equipment requirement includes all six rooms', () => {
  assert.deepEqual(ids(filterRooms(rooms,1,[])),ids(rooms));
});
test('F2 unknown equipment cannot match', () => {
  assert.deepEqual(filterRooms(rooms,1,['Imaginary telescope']),[]);
});
test('F3 blocked room matching filters remains unavailable', () => {
  const result=evaluateSelection(rooms,bookings,'r3',20,['Projector'],'12:00','13:00');
  assert.equal(result.decision,'unavailable');
  assert.match(result.reasons.join(' '),/blocked/);
});
test('F4 empty result for impossible capacity', () => {
  assert.deepEqual(filterRooms(rooms,201,[]),[]);
});
test('F5 integration same interval, different selected room uses its own schedule', () => {
  assert.equal(evaluateSelection(rooms,bookings,'r1',1,[],'10:00','11:00').decision,'unavailable');
  assert.equal(evaluateSelection(rooms,bookings,'r5',1,[],'10:00','11:00').decision,'available');
});
test('F5 integration hidden or unknown selection cannot be reported available', () => {
  for (const id of ['r2','missing','']) {
    assert.deepEqual(evaluateSelection(rooms,bookings,id,100,[],'12:30','13:00'),
      {decision:'unavailable',reasons:['Please select a room.']});
  }
});
test('AC1 parser boundaries and malformed times', () => {
  assert.equal(parseTime('24:00'),1440);
  assert.equal(parseTime('00:00'),0);
  for (const v of ['24:01','25:00','10:60','9:00','','ab:cd']) assert.equal(parseTime(v),null);
});
test('AC1 direct API rejects nonfinite and fractional numbers', () => {
  for (const start of [NaN,Infinity,600.5]) {
    assert.equal(checkAvailability(rooms[0],start,660,540,[]).decision,'unavailable');
  }
});
test('AC1 integration invalid text gives clear feedback', () => {
  assert.match(evaluateSelection(rooms,bookings,'r5',1,[],'24:01','25:00').reasons[0],/valid times/);
});
test('AC5 filtering and availability preserve frozen data and its order', () => {
  const r=structuredClone(rooms), b=structuredClone(bookings);
  for (const item of r) { Object.freeze(item.equipment); Object.freeze(item); }
  for (const item of b) Object.freeze(item);
  Object.freeze(r); Object.freeze(b);
  const before=JSON.stringify({r,b});
  filterRooms(r,1,['Projector']);
  evaluateSelection(r,b,'r5',1,[],'10:00','11:00');
  evaluateSelection(r,b,'r1',1,[],'10:00','11:00');
  assert.equal(JSON.stringify({r,b}),before);
});
