# kanji-stroke-surgeon
A Node.js utility designed to perform "surgery" on messy Kanji SVG path data. 

### The Problem
When importing Kanji SVG data into Anki, browser parsers often "eject" `<path>` elements from `<svg>` containers if the surrounding HTML contains malformed tags or ghost text. This breaks animation engines. 

### The Solution
`kanji-stroke-surgeon` automates the process of:
1. **Fetching:** Processing raw KanjiVG file data.
2. **Incision:** Stripping away XML metadata, CSS, and rogue HTML tags.
3. **Suturing:** Combining valid `<path>` elements into a single, clean, namespace-compliant string ready for Anki.

### Getting Started
1. **Clone the repo:** `git clone https://github.com/your-username/kanji-stroke-surgeon.git`
2. **Install:** `npm install`
3. **Load Data:** Place your KanjiVG `.svg` files into the `/raw-data` folder.
4. **Operate:** Run the surgeon: `node surgeon.js`

### Why it was made
KanjiVG already has a utility for this problem, so the purpose of making this tool is to practice making a similar tool via Node.js.