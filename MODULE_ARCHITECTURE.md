# FreeWebNovel Module Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Ketsu Module System                       │
│                  (freewebnovel.com Reader)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   moduleTemplate.json                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Module Info: Name, ID, Version, Base URL, etc.       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Global: Headers, Cookies, Variables                   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Pages: mainPage, search, info, chapters              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Request  │  │JavaScript│  │  Output  │
        │  Config  │  │  Logic   │  │ Structure│
        └──────────┘  └──────────┘  └──────────┘
```

## Data Flow Architecture

### 1. Main Page Flow

```
User Opens App
      │
      ▼
┌─────────────────┐
│  Load Main Page │
│  (MainPage.html)│
└─────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│ HTTP GET: https://freewebnovel.com/ │
└─────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│  Execute JavaScript in Page Context  │
│  - Parse HTML with DOM selectors     │
│  - Extract 3 sections:               │
│    1. Hot Novels (carousel)          │
│    2. Hot Novels (grid)              │
│    3. New Chapters (list)            │
│    4. Completed Novels (vertical)    │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│  Build Output Array                  │
│  - Section 1: Special3 + centered    │
│  - Section 2: Special1 + triplets    │
│  - Section 3: small2 + custom layout │
│  - Section 4: wide6 + longDoublets   │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│  Store in #ketsu-final-data as JSON  │
└──────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│  Ketsu App Renders UI                │
│  - Displays sections with layouts    │
│  - Shows images, titles, metadata    │
└──────────────────────────────────────┘
```

### 2. Search Flow

```
User Enters Search Query: "martial peak"
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Build Search URL                               │
│  - Replace spaces with +                        │
│  - URL: /search/?searchkey=martial+peak         │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  HTTP GET: Search URL                           │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Execute JavaScript (Search.html)               │
│  - Select: #list-page .list-novel .row          │
│  - Extract: image, title, chapter count         │
│  - Build absolute URLs                          │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Build Output                                   │
│  - Cell: wide8                                  │
│  - Layout: vertical grid                        │
│  - Data: Array of novels                        │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Display Results                                │
│  - Grid of novels with images                   │
│  - Clickable to open info page                  │
└─────────────────────────────────────────────────┘
```

### 3. Novel Info Flow (Two-Stage)

```
User Clicks Novel
      │
      ▼
┌─────────────────────────────────────────────────┐
│  STAGE 1: Initial Page Load (Info.html)        │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  HTTP GET: /novel-slug.html                     │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Execute JavaScript (Info.html)                 │
│  - Extract: title, description, genres, status  │
│  - Extract: cover image, novel ID               │
│  - Extract: initial chapters from ul.ul-list5   │
│  - Build AJAX request URL                       │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Store Partial Data in #ketsu-final-data        │
│  - Contains: basic info + initial chapters      │
│  - Next request: AJAX chapter archive           │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  STAGE 2: AJAX Chapter Load (Info2.html)       │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  HTTP GET: /ajax/chapter-archive?novelId=<id>  │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Receive JavaScript-Wrapped HTML Response       │
│  Format: /* <div>...</div> */                   │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Execute JavaScript (Info2.html)                │
│  - Parse response (remove /* and */)            │
│  - Create temp div, insert HTML                 │
│  - Select: .panel-body li                       │
│  - Extract: complete chapter list               │
│  - Update output.chapters array                 │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Update #ketsu-final-data with Complete Info    │
│  - All chapters now available                   │
│  - Chapter count updated                        │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Display Novel Info Page                        │
│  - Cover image, title, description              │
│  - Genres, status, chapter count                │
│  - Scrollable chapter list                      │
└─────────────────────────────────────────────────┘
```

### 4. Chapter Reading Flow

```
User Clicks Chapter
      │
      ▼
┌─────────────────────────────────────────────────┐
│  HTTP GET: /novel-slug/chapter-X.html           │
│  Headers: Referer = novel info page URL         │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Execute JavaScript (Chapters.html)             │
│  - Select: .txt-c                               │
│  - Extract: textContent                         │
│  - Filter: Remove ad scripts                    │
│    Pattern: (adsbygoogle = ...).push({});       │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Build Output                                   │
│  - text: { text: cleanedContent }               │
│  - videos: null                                 │
│  - images: null                                 │
└─────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  Display Chapter Content                        │
│  - Clean text in reading view                   │
│  - Navigation to prev/next chapter              │
└─────────────────────────────────────────────────┘
```

## Component Architecture

### JavaScript Object Hierarchy

```
ModuleRequest
├── url: string
├── method: "get" | "post"
├── headers: KeyValue[]
└── httpBody: string | null

KeyValue
├── key: string
└── value: string

Output (varies by page type)
├── MainPage Output
│   ├── cellDesing: string
│   ├── orientation: string
│   ├── defaultLayout: string
│   ├── paging: string
│   ├── section: Section
│   ├── layout: Layout | null
│   └── data: Data[]
│
├── Search Output
│   └── (same as MainPage)
│
├── Info Output
│   ├── image: ModuleRequest
│   ├── title: string
│   ├── link: ModuleRequest
│   ├── description: string
│   ├── genres: string[]
│   ├── field1-4: string
│   └── chapters: Chapter[]
│
└── Chapter Output
    ├── videos: null
    ├── images: null
    └── text: Text

Section
├── sectionName: string
└── separator: boolean

Layout
├── insets: Insets
├── visibleCellsWidthS: number
├── visibleCellsWidthM: number
├── visibleCellsWidthL: number
├── visibleCellsHeight: number
├── heightForVisibleCells: number
├── cellSize: Size
├── ratio: Ratio | null
├── constant: Size
├── horizontalSpacing: number
└── verticalSpacing: number

Data
├── image: ModuleRequest
├── title: string
├── description: string
├── field1-4: string
├── isChapter: boolean
├── link: ModuleRequest
└── openInWebView: boolean

Chapter
├── chapName: string
├── link: ModuleRequest
└── openInWebView: boolean

Text
└── text: string
```

## Selector Strategy

### Main Page Selectors

```css
/* Hot Novels Section */
.index-novel:nth-child(1)           /* First novel section */
  .item                             /* Individual novel item */
    img                             /* Cover image */
    a                               /* Link to novel */
      .title                        /* Novel title */

/* New Chapters Section */
.index-novel:nth-child(2)           /* Second novel section */
  .row                              /* Chapter update row */
    a                               /* Link to novel */
    h3                              /* Novel title */

/* Completed Novels Section */
#index-novel-completed              /* Completed section */
  .row                              /* Container row */
    .col-md-2                       /* Individual novel column */
      img                           /* Cover image */
      a                             /* Link to novel */
      h3                            /* Novel title */
      .label-primary                /* Status label */
```

### Search Page Selectors

```css
#list-page                          /* Search results container */
  .list-novel                       /* Novel list wrapper */
    .row                            /* Individual result row */
      img                           /* Cover image */
      a                             /* Link to novel */
      .novel-title                  /* Novel title */
      .chr-text                     /* Chapter count */
```

### Info Page Selectors

```css
/* Basic Info */
h3.tit                              /* Novel title */
.det-desc                           /* Description text */
.book img                           /* Cover image */

/* Metadata */
.info-meta                          /* Metadata container */
  li                                /* Metadata items */
    /* Contains: "Genre: ...", "Status: ...", etc. */

/* Novel ID for AJAX */
#rating[data-novel-id]              /* Novel ID attribute */

/* Initial Chapters */
ul.ul-list5                         /* Chapter list */
  li                                /* Chapter item */
    a                               /* Chapter link */

/* AJAX Response Chapters */
.panel-body                         /* AJAX response container */
  li                                /* Chapter item */
    a                               /* Chapter link */
```

### Chapter Page Selectors

```css
.txt-c                              /* Chapter content container */
  /* Contains chapter text + ads */

/* Alternative selector */
#chapter-content                    /* Alternative content container */
```

## Error Handling Strategy

### Cloudflare Protection

```
┌─────────────────────────────────────┐
│  HTTP Request                       │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Cloudflare Challenge?              │
└─────────────────────────────────────┘
         Yes  │  No
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐      ┌─────────────┐
│ Browser │      │ Direct Fetch│
│  Mode   │      │  (Fast)     │
└─────────┘      └─────────────┘
    │                   │
    ▼                   ▼
┌─────────────────────────────────────┐
│  Wait for Challenge Completion      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Execute JavaScript                 │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Extract Data                       │
└─────────────────────────────────────┘
```

### Fallback Selectors

```javascript
// Primary selector
let content = document.querySelector('.txt-c');

// Fallback if primary fails
if (!content) {
  content = document.querySelector('#chapter-content');
}

// Final fallback
if (!content) {
  content = document.querySelector('.chapter-body');
}
```

### Data Validation

```javascript
// Validate before returning
if (!title || title.trim() === '') {
  title = 'Unknown Title';
}

if (!genres || genres.length === 0) {
  genres = ['Unknown'];
}

if (!chapters || chapters.length === 0) {
  console.warn('No chapters found');
}
```

## Performance Optimization

### Request Batching

```
Main Page:
  1 request → 3 sections of data
  (Efficient: Single page load)

Search:
  1 request per search
  (Efficient: Direct results)

Info Page:
  2 requests → Complete novel info
  Request 1: Basic info + initial chapters
  Request 2: Complete chapter list via AJAX
  (Acceptable: Necessary for complete data)

Chapter:
  1 request per chapter
  (Efficient: On-demand loading)
```

### Caching Strategy

```
┌─────────────────────────────────────┐
│  Cache Layer (Ketsu App)            │
├─────────────────────────────────────┤
│  - Novel covers (images)            │
│  - Novel info (metadata)            │
│  - Chapter lists                    │
│  - Read chapters (text)             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Network Layer                      │
│  - Only fetch if not cached         │
│  - Respect cache expiry             │
└─────────────────────────────────────┘
```

## Security Considerations

### Header Management

```javascript
// Always include Referer for subsequent requests
headers: [
  new KeyValue('Referer', 'https://freewebnovel.com/')
]

// User-Agent for Cloudflare
headers: [
  new KeyValue('User-Agent', 'Mozilla/5.0 ...')
]
```

### URL Sanitization

```javascript
// Always construct absolute URLs
let link = 'https://freewebnovel.com' + relativeLink;

// Validate URL format
if (!link.startsWith('https://freewebnovel.com')) {
  console.error('Invalid URL:', link);
}
```

### Content Filtering

```javascript
// Remove ad scripts
text = replaceAll(text, '(adsbygoogle = window.adsbygoogle || []).push({});', '');

// Remove tracking scripts
text = replaceAll(text, '<script>ga(', '');

// Sanitize HTML entities
text = text.replace(/&nbsp;/g, ' ');
```

## Module Lifecycle

```
┌─────────────────────────────────────┐
│  1. Module Installation             │
│  - User imports moduleTemplate.json │
│  - Ketsu validates structure        │
│  - Module added to source list      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  2. Module Initialization           │
│  - Load module configuration        │
│  - Set base URL and headers         │
│  - Prepare JavaScript contexts      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  3. Runtime Execution               │
│  - User navigates pages             │
│  - Execute page-specific JavaScript │
│  - Extract and display data         │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  4. Module Updates                  │
│  - Check UpdateSite URL             │
│  - Download new version if available│
│  - Merge with user preferences      │
└─────────────────────────────────────┘
```

## Testing Architecture

```
┌─────────────────────────────────────┐
│  Unit Tests                         │
│  - Test individual functions        │
│  - Validate data structures         │
│  - Check selector logic             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Integration Tests                  │
│  - Test page flows                  │
│  - Verify AJAX requests             │
│  - Check data transformation        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  End-to-End Tests                   │
│  - Test complete user journeys      │
│  - Verify in module-creator.com     │
│  - Test in Ketsu app                │
└─────────────────────────────────────┘
```

---

**Architecture Version**: 1.0  
**Last Updated**: November 16, 2025  
**Compatibility**: Ketsu Module System v1.0+
