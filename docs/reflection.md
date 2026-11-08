# Personal reflection - student review draft

For this assignment, I asked Codex to continue my Smart Campus prototype instead of starting an unrelated application. I supplied the assignment PDF, my name and ID, the class time, and the requirement to preserve AC1-AC6. The useful repository context was the existing React interface, booking rules, fictional data, and eighteen regression tests. This made the task more specific than simply asking AI to improve the code.

The most useful design suggestion was to separate filtering from availability. Capacity and equipment decide which rooms are shown, while the original booking rules decide whether the chosen interval is allowed. Another useful decision was to derive the result from the current selection. Keeping a separately stored result would require remembering to reset it in several event handlers, so that option was rejected.

The evidence contains actual automated runs, including the 120/121-minute boundary, touching intervals, exact capacity, and bookings belonging to different rooms. Codex also checked the interface through connected Chrome. I have not yet independently repeated those checks, so I should not describe the automated run as my own manual verification. Before submission, I need to review the room-switching example and explain the overlap condition in my own words.

Tests made the changes easier to judge because the original eighteen checks still pass alongside the new catalog cases. The failed standalone browser launch is also recorded instead of hidden. Next, I would make browser testing easier to reproduce in continuous integration and improve keyboard navigation. I would keep persistence and authentication outside this assignment's scope.
