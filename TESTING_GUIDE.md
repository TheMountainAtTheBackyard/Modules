# FreeWebNovel Module - Testing Guide

## Pre-Testing Checklist

- [ ] `moduleTemplate.json` exists and is valid JSON
- [ ] All HTML files exist (MainPage, Search, Info, Info2, Chapters)
- [ ] Node.js installed (for validation script)
- [ ] Browser with DevTools available
- [ ] Internet connection active

## Validation Testing

### 1. JSON Structure Validation

```bash
# Run the validation script
node validate_module.js

# Expected output:
# ✓ All validations passed!
# ℹ Module is ready to use with module-creator.com
```

**What it checks:**
- JSON syntax validity
- Required fields in moduleInfo
- Page section structures
- JavaScript code presence
- HTML file existence
- CSS selector usage
- URL patterns
- Common issues

### 2. Manual JSON Validation

```bash
# Use online validator
# Visit: https://jsonlint.com/
# Paste moduleTemplate.json content
# Click "Validate JSON"
```

**Expected result:** "Valid JSON"

## Browser Testing (Without Module Creator)

### 1. Test Main Page Selectors

```javascript
// Open https://freewebnovel.com/ in browser
// Open DevTools Console (F12)
// Run these commands:

// Test hot novels section
let hotNovels = document.querySelectorAll('.index-novel')[0].querySelectorAll('.item');
console.log('Hot novels found:', hotNovels.length);
// Expected: 10-20 items

// Test new chapters section
let newChapters = document.querySelectorAll('.index-novel')[1].querySelectorAll('.row');
console.log('New chapters found:', newChapters.length);
// Expected: 20-30 items

// Test completed novels
let completed = document.querySelector('#index-novel-completed').querySelectorAll('.col-md-2');
console.log('Completed novels found:', completed.length);
// Expected: 6-12 items

// Test image extraction
let firstImage = hotNovels[0].querySelector('img').src;
console.log('First image URL:', firstImage);
// Expected: Full URL starting with https://
```

### 2. Test Search Selectors

```javascript
// Navigate to: https://freewebnovel.com/search/?searchkey=martial+peak
// Open DevTools Console

// Test search results
let results = document.querySelector('#list-page .list-novel').querySelectorAll('.row');
console.log('Search results found:', results.length);
// Expected: 10+ results

// Test title extraction
let firstTitle = results[0].querySelector('.novel-title').textContent.trim();
console.log('First result title:', firstTitle);
// Expected: Novel title text

// Test chapter count
let chapterCount = results[0].querySelector('.chr-text').textContent;
console.log('Chapter count:', chapterCount);
// Expected: "XXX Chapters"
```

### 3. Test Info Page Selectors

```javascript
// Navigate to any novel page (e.g., from search results)
// Open DevTools Console

// Test title
let title = document.querySelector('h3.tit').textContent;
console.log('Novel title:', title);
// Expected: Novel title

// Test description
let desc = document.querySelector('.det-desc').textContent.trim();
console.log('Description length:', desc.length);
// Expected: 100+ characters

// Test cover image
let cover = document.querySelector('.book img').src;
console.log('Cover URL:', cover);
// Expected: Full image URL

// Test metadata
let metaItems = document.querySelector('.info-meta').querySelectorAll('li');
console.log('Metadata items:', metaItems.length);
// Expected: 3-5 items

// Test genre extraction
let genreText = '';
metaItems.forEach(item => {
  if (item.innerText.includes('Genre:')) {
    genreText = item.innerText.replace('Genre:', '').trim();
  }
});
let genres = genreText.split(', ');
console.log('Genres:', genres);
// Expected: Array of genre strings

// Test novel ID
let novelId = document.querySelector('#rating').getAttribute('data-novel-id');
console.log('Novel ID:', novelId);
// Expected: Numeric ID

// Test initial chapters
let chapters = document.querySelector('ul.ul-list5').querySelectorAll('li');
console.log('Initial chapters:', chapters.length);
// Expected: 10-50 chapters
```

### 4. Test AJAX Chapter Loading

```javascript
// On a novel info page
// Open DevTools Network tab
// Look for request to: /ajax/chapter-archive?novelId=...

// In Console, test AJAX response parsing:
let novelId = document.querySelector('#rating').getAttribute('data-novel-id');
console.log('Fetching chapters for novel ID:', novelId);

fetch(`https://freewebnovel.com/ajax/chapter-archive?novelId=${novelId}`)
  .then(r => r.text())
  .then(data => {
    console.log('AJAX response length:', data.length);
    
    // Parse response
    let cleaned = data.replace('/*', '').replace('*/', '');
    let div = document.createElement('div');
    div.innerHTML = cleaned;
    
    let allChapters = div.querySelector('.panel-body').querySelectorAll('li');
    console.log('Total chapters from AJAX:', allChapters.length);
    // Expected: 100-3000+ chapters
  });
```

### 5. Test Chapter Content

```javascript
// Navigate to any chapter page
// Open DevTools Console

// Test content extraction
let content = document.querySelector('.txt-c').textContent;
console.log('Content length:', content.length);
// Expected: 1000+ characters

// Test ad filtering
let hasAds = content.includes('adsbygoogle');
console.log('Contains ads:', hasAds);
// Expected: true (before filtering)

// Test filtering
let cleaned = content.split('(adsbygoogle = window.adsbygoogle || []).push({});').join('');
let stillHasAds = cleaned.includes('adsbygoogle');
console.log('Still has ads after filtering:', stillHasAds);
// Expected: false
```

## Module Creator Testing

### 1. Upload Module

**Steps:**
1. Go to https://module-creator.com/
2. Click "Import Module" or "Load JSON"
3. Select `moduleTemplate.json`
4. Wait for module to load

**Expected result:**
- Module loads without errors
- Module info displays correctly
- All pages show in navigation

**Troubleshooting:**
- ❌ **Parse error**: Validate JSON syntax
- ❌ **Missing fields**: Check required fields in moduleInfo
- ❌ **Load timeout**: Check file size and internet connection

### 2. Test Main Page

**Steps:**
1. Navigate to "Main Page" tab
2. Click "Test" or "Preview"
3. Wait for page to load (may take 5-10 seconds due to Cloudflare)

**Expected result:**
- 3-4 sections display
- Section 1: Carousel with images
- Section 2: Grid of hot novels
- Section 3: List of new chapters
- Section 4: Vertical list of completed novels
- Images load correctly
- Titles are readable
- Links are clickable

**Troubleshooting:**
- ❌ **No data**: Enable browser mode for Cloudflare
- ❌ **Broken images**: Check image URL construction
- ❌ **Wrong layout**: Verify cell design settings
- ❌ **Timeout**: Increase timeout in settings

### 3. Test Search

**Test Cases:**

| Query | Expected Results | Min Results |
|-------|-----------------|-------------|
| `martial peak` | Martial Peak novels | 5+ |
| `cultivation` | Cultivation genre novels | 20+ |
| `system` | System-based novels | 30+ |
| `reincarnation` | Reincarnation theme | 20+ |
| `asdfghjkl` | No results or empty | 0 |

**Steps:**
1. Navigate to "Search" tab
2. Enter test query
3. Click "Search"
4. Wait for results

**Expected result:**
- Results display in grid layout
- Each result shows:
  - Cover image
  - Novel title
  - Chapter count
  - Clickable link
- Results are relevant to query

**Troubleshooting:**
- ❌ **No results for valid query**: Check search URL format
- ❌ **Wrong separator**: Verify spaces → `+` conversion
- ❌ **Broken layout**: Check cell design configuration

### 4. Test Novel Info

**Steps:**
1. From main page or search, click any novel
2. Wait for info page to load
3. Wait additional 2-3 seconds for AJAX chapter load

**Expected result:**
- Cover image displays (large)
- Title is correct
- Description is readable (100+ characters)
- Genres display as tags (3-5 genres)
- Status shows (Ongoing/Completed)
- Chapter count updates after AJAX load
- Chapter list is scrollable
- All chapters are clickable

**Troubleshooting:**
- ❌ **Missing chapters**: Check AJAX request in Network tab
- ❌ **No novel ID**: Verify `#rating[data-novel-id]` selector
- ❌ **Wrong genres**: Check `.info-meta li` parsing
- ❌ **Incomplete list**: Verify Info2.html is configured

### 5. Test Chapter Reading

**Steps:**
1. From chapter list, click first chapter
2. Wait for content to load
3. Scroll through content

**Expected result:**
- Chapter content displays as clean text
- No ad scripts visible
- No navigation elements in content
- Text is readable
- Proper paragraph breaks

**Troubleshooting:**
- ❌ **Ad content visible**: Check ad filtering regex
- ❌ **No text**: Verify `.txt-c` selector
- ❌ **Formatting issues**: Check text extraction method
- ❌ **Extra elements**: Improve content filtering

## Integration Testing

### Full User Journey Test

**Scenario 1: Browse and Read**
```
1. Open app → Main page loads
2. Browse hot novels → See 10+ novels
3. Click novel → Info page loads
4. Wait for chapters → See 100+ chapters
5. Click chapter 1 → Content loads
6. Read content → Clean text visible
7. Navigate to chapter 2 → Next chapter loads
```

**Scenario 2: Search and Read**
```
1. Open app → Main page loads
2. Enter search: "martial peak"
3. Click search → Results display
4. Click first result → Info page loads
5. Click latest chapter → Content loads
6. Read content → Clean text visible
```

**Scenario 3: Browse Completed Novels**
```
1. Open app → Main page loads
2. Scroll to completed section
3. Click completed novel → Info page loads
4. Verify status: "Completed"
5. Check chapter count → Matches expected
6. Click last chapter → Content loads
```

## Performance Testing

### Load Time Benchmarks

| Page Type | Expected Load Time | Acceptable Max |
|-----------|-------------------|----------------|
| Main Page | 2-5 seconds | 10 seconds |
| Search | 1-3 seconds | 8 seconds |
| Info (Stage 1) | 2-4 seconds | 10 seconds |
| Info (Stage 2) | 1-2 seconds | 5 seconds |
| Chapter | 1-3 seconds | 8 seconds |

**Testing:**
```javascript
// In browser console
console.time('pageLoad');
// Navigate to page
// Wait for content to load
console.timeEnd('pageLoad');
// Check time against benchmarks
```

### Memory Usage

**Expected:**
- Main Page: < 50 MB
- Search: < 30 MB
- Info: < 40 MB
- Chapter: < 20 MB

**Testing:**
```
1. Open DevTools → Performance tab
2. Click "Record"
3. Navigate through pages
4. Stop recording
5. Check memory usage in timeline
```

## Error Handling Testing

### Test Error Scenarios

**1. Network Errors**
```
Test: Disconnect internet during page load
Expected: Error message displays
Recovery: Retry button works
```

**2. Invalid URLs**
```
Test: Manually enter invalid novel URL
Expected: 404 or error page
Recovery: Back button returns to main page
```

**3. Missing Content**
```
Test: Navigate to deleted novel
Expected: Error message or empty state
Recovery: Graceful fallback
```

**4. Cloudflare Block**
```
Test: Rapid requests trigger rate limit
Expected: Cloudflare challenge appears
Recovery: Wait and retry
```

**5. Malformed Data**
```
Test: Novel with missing metadata
Expected: Default values used
Recovery: Page still displays
```

## Regression Testing

### After Module Updates

**Checklist:**
- [ ] Main page still loads
- [ ] Search still works
- [ ] Info page displays correctly
- [ ] Chapters load completely
- [ ] Chapter content is clean
- [ ] Images still load
- [ ] Links are still absolute
- [ ] AJAX still triggers
- [ ] Ad filtering still works
- [ ] Layouts render correctly

### After Website Changes

**Monitor for:**
- CSS class name changes
- HTML structure changes
- URL pattern changes
- AJAX endpoint changes
- New ad formats
- Cloudflare updates

**Update process:**
1. Identify broken selectors
2. Update HTML files
3. Update moduleTemplate.json
4. Run validation script
5. Test in module creator
6. Deploy update

## Automated Testing Script

```javascript
// test_module.js
const puppeteer = require('puppeteer');

async function testModule() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log('Testing Main Page...');
  await page.goto('https://freewebnovel.com/');
  await page.waitForSelector('.index-novel');
  const hotNovels = await page.$$('.index-novel .item');
  console.log(`✓ Found ${hotNovels.length} hot novels`);
  
  console.log('Testing Search...');
  await page.goto('https://freewebnovel.com/search/?searchkey=martial+peak');
  await page.waitForSelector('#list-page');
  const results = await page.$$('.list-novel .row');
  console.log(`✓ Found ${results.length} search results`);
  
  console.log('Testing Info Page...');
  await page.click('.list-novel .row:first-child a');
  await page.waitForSelector('h3.tit');
  const title = await page.$eval('h3.tit', el => el.textContent);
  console.log(`✓ Novel title: ${title}`);
  
  console.log('Testing Chapter...');
  await page.click('ul.ul-list5 li:first-child a');
  await page.waitForSelector('.txt-c');
  const content = await page.$eval('.txt-c', el => el.textContent);
  console.log(`✓ Chapter content length: ${content.length}`);
  
  await browser.close();
  console.log('\n✓ All tests passed!');
}

testModule().catch(console.error);
```

## Test Report Template

```markdown
# Module Test Report

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Module Version:** 1.0

## Test Results

### Validation
- [ ] JSON structure: PASS/FAIL
- [ ] HTML files: PASS/FAIL
- [ ] Selectors: PASS/FAIL

### Functionality
- [ ] Main page: PASS/FAIL
- [ ] Search: PASS/FAIL
- [ ] Info page: PASS/FAIL
- [ ] Chapter reading: PASS/FAIL

### Performance
- [ ] Load times: PASS/FAIL
- [ ] Memory usage: PASS/FAIL

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]

## Conclusion
[Overall assessment]
```

## Continuous Testing

### Daily Checks
- [ ] Main page loads
- [ ] Search works
- [ ] One novel info loads
- [ ] One chapter loads

### Weekly Checks
- [ ] All page types tested
- [ ] Performance benchmarks met
- [ ] No new errors in console
- [ ] Images loading correctly

### Monthly Checks
- [ ] Full regression test
- [ ] Update selectors if needed
- [ ] Review error logs
- [ ] Update documentation

---

**Testing Guide Version**: 1.0  
**Last Updated**: November 16, 2025
