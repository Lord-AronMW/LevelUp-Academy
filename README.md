# LevelUP Academy

A beginner-friendly guide for people who have just installed VALORANT and want to understand the basics.

## Description

LevelUP Academy is a one-page learning website that introduces new players to the essentials of VALORANT. It explains how rounds work, the roles of attackers and defenders, agent roles, the in-game economy, basic aim habits, map awareness, and a 20-minute warm-up routine. It also includes a small glossary to help beginners understand common callouts and terms used by teammates.

The website is built with plain HTML, CSS, and JavaScript. It has 10 sections arranged in a vertical, slide-like experience, with scroll-based text animations, rolling numbers, a custom crosshair cursor, and a small Spike-planting and defusing game. No framework, build step, or package installation is required.

*This is a fan-made project and is not affiliated with or endorsed by Riot Games.*

## Screenshots
![Website image](image-1.png)

## Getting Started

### Dependencies

- A modern web browser. The website has mainly been tested in Google Chrome; Microsoft Edge should also work.
- An internet connection for loading the fonts from Google Fonts. The website still works without internet, but the typography may look different.
- No frameworks, package managers, or build tools are required.

### Installing

1. Open the project repository on GitHub.
2. Download the repository as a ZIP file and extract it, or clone the repository using Git.
3. Keep `index.html`, `style.css`, `script.js`, and the `assets` folder together in the same project directory.
4. Make sure the image filenames inside `assets/` match the exact names listed in the **Help** section.

No additional installation or configuration is needed.

### Executing program

1. Open the project folder.
2. Double-click `index.html` to open the website in your browser.

## Help

If something does not look right, try the following:

- **Missing images:** Check that the image files are inside the `assets` folder and that their names use the exact lowercase spelling: `phoenix.jpg`, `sova.jpg`, `brimstone.jpg`, `sage.jpg`, and `rifle.png`.
- **Images not loading:** Open your browser's developer console and check for missing-file (`404`) errors. The rest of the website should continue to work even if an image is missing.
- **Fonts look different:** Connect to the internet so Google Fonts can load. The site uses Barlow Condensed, Inter, and JetBrains Mono.
- **Sections do not fit in a short window:** Some sections may require scrolling inside them when the browser window is very short. This is intentional to keep the content readable.
- **Animations are not playing:** Animations are reduced or disabled when your device is set to prefer reduced motion.

The gameplay tips are simplified for beginners. VALORANT's other game details may change with updates, so check the current in-game information.

## Project Structure

```text
LevelUP-Academy/
├── index.html    # Page content and structure
├── style.css     # Website styling and layout
├── script.js     # Slider, animations, rolling numbers, and Spike game
└── assets/       # Agent and weapon images
```

## License

This project is licensed under the terms described in the [`MIT LICENSE`](LICENSE) file.

The VALORANT name, agents, and related game artwork belong to Riot Games. 

## Credits

- **Fonts:** Barlow Condensed, Inter, and JetBrains Mono via Google Fonts.
- **Game and agent artwork:** Riot Games.
