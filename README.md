# FreeWebNovel.com Ketsu Module

A complete module for reading light novels from [freewebnovel.com](https://freewebnovel.com/) using the Ketsu module system.

## Module Information

- **Module Name**: Free Web Novel
- **Module Initials**: FWN
- **Base URL**: https://freewebnovel.com/
- **Module Type**: Text (Light Novels)
- **Language**: English
- **Version**: 1.0

## Features

✅ **Main Page** - Browse hot novels, new chapters, and completed novels  
✅ **Search** - Search for novels by keyword  
✅ **Novel Info** - View novel details, genres, status, and chapter list  
✅ **Chapter Reading** - Read novel chapters with clean text extraction  
✅ **AJAX Chapter Loading** - Automatically loads complete chapter archives  

## File Structure

```
/vercel/sandbox/
├── moduleTemplate.json      # Main module configuration
├── MainPage/
│   └── MainPage.html       # Homepage scraping logic
├── Search/
│   └── Search.html         # Search results scraping logic
├── Info/
│   ├── Info.html           # Novel info page (initial load)
│   └── Info2.html          # Novel info page (AJAX chapter archive)
└── Chapters/
    └── Chapters.html       # Chapter content extraction
```

## How It Works

### 1. Main Page (`MainPage.html`)

Extracts three sections from the homepage:

- **Hot Novels** - Featured novels with images (carousel layout)
- **New Chapters** - Recently updated novels (grid layout)
- **Completed Novels** - Finished novels (vertical list)

**CSS Selectors:**
- Hot: `.index-novel:first .item`
- New: `.index-novel:nth(1) .row`
- Completed: `#index-novel-completed .col-md-2`

### 2. Search (`Search.html`)

Searches novels using the URL pattern:
```
https://freewebnovel.com/search/?searchkey=<query>
```

- Spaces are replaced with `+`
- Results displayed in grid layout
- Shows novel image, title, and chapter count

**CSS Selectors:**
- Results: `#list-page .list-novel .row`
- Title: `.novel-title`
- Chapter count: `.chr-text`

### 3. Novel Info (`Info.html` + `Info2.html`)

Two-stage loading process:

**Stage 1 (Info.html):**
- Loads basic novel information
- Extracts title, description, genres, status, cover image
- Gets novel ID from `#rating[data-novel-id]`
- Loads initial chapter list from `ul.ul-list5`
- Triggers AJAX request to load complete chapter archive

**Stage 2 (Info2.html):**
- Receives AJAX response from `/ajax/chapter-archive?novelId=<id>`
- Parses JavaScript-wrapped HTML response
- Extracts complete chapter list from `.panel-body li`
- Updates chapter count

**CSS Selectors:**
- Title: `h3.tit`
- Description: `.det-desc`
- Cover: `.book img`
- Metadata: `.info-meta li`
- Chapters: `ul.ul-list5 li` → `.panel-body li`

### 4. Chapter Content (`Chapters.html`)

Extracts chapter text content:

- Reads from `.txt-c` container
- Removes ad scripts: `(adsbygoogle = window.adsbygoogle || []).push({});`
- Returns clean text content

**CSS Selectors:**
- Content: `.txt-c`

## Technical Details

### JavaScript Execution

All pages use JavaScript to:
1. Parse HTML using DOM selectors
2. Extract data into structured objects
3. Store results in `#ketsu-final-data` element as JSON

### Data Structures

**MainPage Output:**
```javascript
{
  cellDesing: "Special3" | "Special1" | "wide6" | "small2",
  orientation: "horizontal" | "vertical",
  defaultLayout: "triplets" | "longDoubletsFull" | "none",
  paging: "centered" | "leading" | "none",
  section: { sectionName: string, separator: boolean },
  layout: Layout | null,
  data: Data[]
}
```

**Search Output:**
```javascript
{
  cellDesing: "wide8",
  orientation: "vertical",
  defaultLayout: "none",
  paging: "none",
  section: { sectionName: "", separator: false },
  layout: Layout,
  data: Data[]
}
```

**Info Output:**
```javascript
{
  image: ModuleRequest,
  title: string,
  link: ModuleRequest,
  description: string,
  genres: string[],
  field1: string,  // Status
  field2: string,  // Empty
  field3: string,  // Type (Light Novel)
  field4: string,  // Chapter count
  chapters: Chapter[]
}
```

**Chapter Output:**
```javascript
{
  videos: null,
  images: null,
  text: { text: string }
}
```

### Cloudflare Protection

⚠️ **Important**: The website uses Cloudflare protection

**Bypass Requirements:**
- Use headless browser (Puppeteer/Playwright)
- Wait for Cloudflare challenge to complete
- Execute JavaScript in browser context
- Extract data after page fully loads

**Required Headers:**
```javascript
{
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Referer': 'https://freewebnovel.com/'
}
```

## Module Configuration

### Global Settings

```json
{
  "variables": [],
  "cookies": [],
  "headers": []
}
```

### JavaScript Config

All pages use:
```json
{
  "removeJavascript": true,
  "loadInWebView": false,
  "javaScript": "..."
}
```

## URL Patterns

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Homepage | `https://freewebnovel.com/` | - |
| Search | `https://freewebnovel.com/search/?searchkey=<query>` | `?searchkey=martial+peak` |
| Novel Info | `https://freewebnovel.com/<slug>.html` | `/martial-peak.html` |
| Chapter | `https://freewebnovel.com/<novel>/<chapter>.html` | `/martial-peak/chapter-1.html` |
| AJAX Archive | `https://freewebnovel.com/ajax/chapter-archive?novelId=<id>` | `?novelId=12345` |

## Layout Types

### Cell Designs
- `Special1`, `Special2`, `Special3` - Special layouts for featured content
- `small1`, `small2` - Compact layouts
- `normal1-7` - Standard layouts
- `wide1-11` - Wide layouts

### Default Layouts
- `ultraWide`, `ultraWideFull` - Ultra-wide displays
- `wide`, `wideFull` - Wide displays
- `doublets`, `triplets` - 2 or 3 columns
- `longDoublets`, `longTriplets` - Tall 2 or 3 columns
- Variants: `Full`, `Double`, `Constant`, `List`, `Streched`

### Paging
- `leading` - Pagination at start
- `centered` - Centered pagination
- `none` - No pagination

### Orientation
- `horizontal` - Horizontal scrolling
- `vertical` - Vertical scrolling

## Usage with module-creator.com

1. **Upload** `moduleTemplate.json` to [module-creator.com](https://module-creator.com/)
2. **Test** each page type:
   - Main Page
   - Search (try: "martial peak", "cultivation", etc.)
   - Novel Info (click any novel)
   - Chapter (click any chapter)
3. **Verify** data extraction:
   - Images load correctly
   - Titles and descriptions are clean
   - Chapter lists are complete
   - Chapter content is readable
4. **Export** the module for use in Ketsu app

## Known Issues & Limitations

1. **Cloudflare Protection**: Direct HTTP requests will fail with 403. Requires browser automation.
2. **Ad Scripts**: Chapter content contains ad scripts that are filtered out.
3. **Dynamic Loading**: Chapter archives require AJAX request after initial page load.
4. **Relative URLs**: All links need to be prefixed with base URL.

## Troubleshooting

### Issue: 403 Forbidden Error
**Solution**: Use headless browser with proper headers and wait for Cloudflare challenge.

### Issue: Missing Chapters
**Solution**: Ensure Info2.html AJAX request is triggered with correct novel ID.

### Issue: Broken Images
**Solution**: Add Referer header to image requests.

### Issue: Ad Content in Chapters
**Solution**: Filter out `(adsbygoogle = window.adsbygoogle || []).push({});` strings.

## Development

To modify the module:

1. Edit the appropriate HTML file for the page type
2. Update CSS selectors if website structure changes
3. Test JavaScript extraction logic in browser console
4. Update `moduleTemplate.json` with new JavaScript code
5. Validate JSON structure

## Testing

Test URLs:
- Homepage: https://freewebnovel.com/
- Search: https://freewebnovel.com/search/?searchkey=cultivation
- Novel: https://freewebnovel.com/martial-peak.html (example)
- Chapter: https://freewebnovel.com/martial-peak/chapter-1.html (example)

## License

This module is for educational purposes. Respect the website's terms of service and robots.txt.

## Credits

- **Developer**: user123
- **Module System**: Ketsu
- **Website**: freewebnovel.com

---

**Last Updated**: November 16, 2025  
**Module Version**: 1.0
