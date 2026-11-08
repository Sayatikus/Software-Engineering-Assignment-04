import type { Room, Booking } from './types';

export const rooms: Room[] = [
  { id: 'r1', name: 'Athena Lecture Hall', building: 'Science Block', capacity: 120, blocked: false },
  { id: 'r2', name: 'Newton Lab 201', building: 'Science Block', capacity: 40, blocked: false },
  { id: 'r3', name: 'Curie Seminar Room', building: 'Research Wing', capacity: 20, blocked: true },
  { id: 'r4', name: 'Da Vinci Auditorium', building: 'Arts Centre', capacity: 200, blocked: false },
  { id: 'r5', name: 'Turing Computer Lab', building: 'Tech Tower', capacity: 35, blocked: false },
  { id: 'r6', name: 'Plato Discussion Room', building: 'Humanities Hub', capacity: 16, blocked: true },
];

export const bookings: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 630, title: 'Intro to Physics', bookedBy: 'Dr. Hopper' },
  { id: 'b2', roomId: 'r1', start: 660, end: 750, title: 'Quantum Mechanics', bookedBy: 'Dr. Feynman' },
  { id: 'b3', roomId: 'r1', start: 900, end: 960, title: 'Faculty Meeting', bookedBy: 'Dean Office' },
  { id: 'b4', roomId: 'r2', start: 480, end: 540, title: 'Chemistry Lab', bookedBy: 'Dr. Mendel' },
  { id: 'b5', roomId: 'r2', start: 780, end: 840, title: 'Biology Practical', bookedBy: 'Dr. Watson' },
  { id: 'b6', roomId: 'r4', start: 600, end: 720, title: 'Open Day Presentation', bookedBy: 'Admissions' },
  { id: 'b7', roomId: 'r4', start: 840, end: 900, title: 'Guest Lecture: Renaissance Art', bookedBy: 'Prof. Vasari' },
  { id: 'b8', roomId: 'r5', start: 510, end: 570, title: 'Algorithms Workshop', bookedBy: 'Dr. Knuth' },
  { id: 'b9', roomId: 'r5', start: 840, end: 960, title: 'Hackathon Prep', bookedBy: 'CS Society' },
  { id: 'b10', roomId: 'r2', start: 600, end: 660, title: 'Lesson Boundary Fixture', bookedBy: 'Dr. Archimedes' },
];
