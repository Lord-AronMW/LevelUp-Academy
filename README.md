Overview

LevelUP Academy is a single-page web guide built for players new to VALORANT. It covers how a round works, attacker and defender objectives, agent role selection, credit management, aim habits, map awareness, a 20-minute warm-up routine, and a glossary of common callouts.

The site is structured as a vertical, section-by-section scroller with 10 sections. Built with plain HTML, CSS, and JavaScript — no frameworks, no dependencies, no build step.

Features
One-section-at-a-time scroll navigation
Headline animations and intro text transitions on scroll
Animated number counters for key stats (rounds, credits, timings)
Interactive Spike mechanic on the Attackers & Defenders section: 45-second timer, 4-second plant, 7-second defuse with progress retention on interruption
Custom crosshair cursor with snap-to-interactive-elements behavior
Header theme adapts per section (light/dark)
Respects prefers-reduced-motion — animations are disabled when the system setting is active
Mobile: standard scroll behavior
Running Locally

No setup required.

Direct open:
Download or clone the repository, then open index.html in a browser.

Fonts are loaded from Google Fonts and require an internet connection. The site functions without it; fonts will fall back to system defaults.

Navigation
Input	Action
Mouse wheel / trackpad	Move one section at a time
Arrow Up/Down, Page Up/Down	Move between sections
Home / End	Jump to first / last section
Top navigation menu	Jump to any section
Mobile	Standard scroll
File Structure
index.html    — Content and markup
style.css     — All styles
script.js     — Scroll logic, animations, number counters, Spike game
assets/       — Images

The following files must be present in the assets/ folder, named exactly as listed (all lowercase):

phoenix.jpg
sova.jpg
brimstone.jpg
sage.jpg
rifle.png

Missing files will display alt text or a fallback gradient. A 404 will be logged in the console. All other functionality remains unaffected.

Agent artwork is the property of Riot Games.

Known Limitations
Primarily tested in Chrome. Edge is generally stable. Firefox and Safari have had limited testing.
On short viewport heights (e.g. browser devtools open at the bottom), some sections may overflow and require internal scrolling. This is intentional behavior.
Content reflects beginner-level guidance. In-game prices and values are subject to change with game updates — verify current figures in-game.
Credits
Fonts: Barlow Condensed, Inter, JetBrains Mono (Google Fonts)
VALORANT, all agents, and related assets are the property of Riot Games
License: see LICENSE
