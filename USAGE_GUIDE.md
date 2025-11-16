# FreeWebNovel Module - Usage Guide

## Quick Start with module-creator.com

### Step 1: Access the Module Creator

1. Go to [https://module-creator.com/](https://module-creator.com/)
2. The site provides a visual interface for creating and testing Ketsu modules

### Step 2: Load the Module

**Option A: Upload JSON**
1. Click "Import Module" or "Load JSON"
2. Select `/vercel/sandbox/moduleTemplate.json`
3. The module will be loaded into the editor

**Option B: Copy-Paste**
1. Open `moduleTemplate.json` in a text editor
2. Copy the entire JSON content
3. Paste into the module creator's JSON editor
4. Click "Load" or "Parse"

### Step 3: Test Main Page

1. Navigate to the "Main Page" tab
2. Click "Test" or "Preview"
3. You should see three sections:
   - **Carousel**: Hot novels with images (swipeable)
   - **Grid**: Hot novels in 3-column layout
   - **List**: New chapters (text-based)
   - **Vertical List**: Completed novels with covers

**Expected Output:**
```
Section 1: [Carousel] - 10-20 novels with images
Section 2: [Hot] - Same novels in grid layout
Section 3: [New Chapters] - 20-30 recent updates
Section 4: [Completed] - 6-12 finished novels
```

**Troubleshooting:**
- ❌ **No data**: Cloudflare blocking - enable browser mode
- ❌ **Broken images**: Check image URL construction
- ❌ **Wrong layout**: Verify cell design and layout settings

### Step 4: Test Search

1. Navigate to the "Search" tab
2. Enter a test query: `martial peak` or `cultivation`
3. Click "Search" or "Test"

**Expected Output:**
```
Grid layout with:
- Novel cover images
- Novel titles
- Chapter counts (e.g., "1234 Chapters")
- Clickable links to novel info pages
```

**Test Queries:**
- `martial peak` - Popular novel, should return results
- `cultivation` - Broad genre, many results
- `system` - Common keyword
- `reincarnation` - Popular theme

**Troubleshooting:**
- ❌ **No results**: Check search URL format
- ❌ **Wrong separator**: Ensure spaces → `+` conversion
- ❌ **Missing data**: Verify CSS selectors

### Step 5: Test Novel Info

1. From search results or main page, click any novel
2. The info page should load with:
   - Cover image (large)
   - Novel title
   - Description/synopsis
   - Genres (tags)
   - Status (Ongoing/Completed)
   - Chapter list (may take 2-3 seconds to load fully)

**Expected Output:**
```
Image: [Cover image]
Title: "Martial Peak"
Description: "The journey to the martial peak is a lonely..."
Genres: ["Action", "Adventure", "Fantasy", "Martial Arts"]
Status: "Ongoing"
Type: "Light Novel"
Chapters: "Chapters: 3000"
Chapter List: [Chapter 1, Chapter 2, ..., Chapter 3000]
```

**Two-Stage Loading:**
1. **Stage 1**: Basic info + initial chapters (fast)
2. **Stage 2**: AJAX request for complete chapter list (2-3 seconds)

**Troubleshooting:**
- ❌ **Missing chapters**: AJAX request failed - check Info2.html
- ❌ **No novel ID**: Check `#rating[data-novel-id]` selector
- ❌ **Wrong genres**: Verify `.info-meta li` parsing

### Step 6: Test Chapter Reading

1. From the chapter list, click any chapter
2. The chapter content should display as clean text

**Expected Output:**
```
Clean chapter text without:
- Ad scripts
- Navigation elements
- Comments section
```

**Troubleshooting:**
- ❌ **Ad content visible**: Check ad filtering regex
- ❌ **No text**: Verify `.txt-c` selector
- ❌ **Formatting issues**: Check text extraction method

## Advanced Testing

### Testing with Browser DevTools

1. **Open DevTools** (F12)
2. **Navigate** to freewebnovel.com
3. **Copy** the JavaScript from any HTML file
4. **Paste** into Console
5. **Execute** and inspect results

**Example (Main Page):**
```javascript
// Copy entire MainPage.html <script> content
// Paste in console
// Check output
console.log(JSON.parse(document.getElementById('ketsu-final-data').innerHTML));
```

### Testing CSS Selectors

Use DevTools to verify selectors:

```javascript
// Main Page - Hot Novels
document.querySelectorAll('.index-novel')[0].querySelectorAll('.item')

// Search Results
document.querySelector('#list-page .list-novel').querySelectorAll('.row')

// Info Page - Genres
document.querySelector('.info-meta').querySelectorAll('li')

// Chapter Content
document.querySelector('.txt-c').textContent
```

### Testing AJAX Requests

1. Open Network tab in DevTools
2. Navigate to a novel info page
3. Look for request to `/ajax/chapter-archive?novelId=...`
4. Inspect response (should be JavaScript-wrapped HTML)

**Response Format:**
```javascript
/*
<div class="panel-body">
  <ul>
    <li><a href="/novel/chapter-1.html">Chapter 1</a></li>
    ...
  </ul>
</div>
*/
```

## Module Creator Features

### Visual Editor

- **Request Builder**: Configure HTTP requests
- **Selector Tester**: Test CSS selectors live
- **JavaScript Editor**: Edit extraction logic
- **Preview Panel**: See results in real-time

### Layout Designer

- **Cell Design**: Choose from 20+ cell layouts
- **Grid Configuration**: Set columns for different screen sizes
- **Spacing**: Adjust horizontal/vertical spacing
- **Insets**: Set padding around content

### Export Options

1. **JSON Export**: Download `moduleTemplate.json`
2. **QR Code**: Share module via QR code
3. **Direct Link**: Get shareable URL
4. **Ketsu Import**: Copy import code for Ketsu app

## Integration with Ketsu App

### Installing the Module

1. **Open Ketsu App**
2. **Go to**: Settings → Modules → Add Module
3. **Choose method**:
   - Scan QR code from module-creator.com
   - Paste module URL
   - Import JSON file

### Using the Module

1. **Browse**: Main page shows featured novels
2. **Search**: Use search bar to find novels
3. **Read**: Click novel → Select chapter → Read
4. **Bookmark**: Save favorite novels
5. **Track**: Mark chapters as read

### Module Settings in Ketsu

- **Update URL**: Auto-update module from GitHub
- **Preferred Server**: (Not used for this module)
- **Blacklist**: Block specific novels/chapters
- **Headers**: Add custom HTTP headers if needed

## Customization

### Changing Layouts

Edit `MainPage.html` output sections:

```javascript
// Change from triplets to doublets
output.push(new Output(
  CellDesings.Special1,
  Orientation.horizontal,
  DefaultLayouts.doublets,  // Changed from triplets
  Paging.leading,
  new Section('Hot', true),
  null,
  dataArray
));
```

### Adding Custom Fields

Modify `Data` objects to include more info:

```javascript
function Data(image, title, description, field1, field2, field3, field4, isChapter, link, openInWebView) {
  this.image = image;
  this.title = title;
  this.description = description;
  this.field1 = field1;  // Status
  this.field2 = field2;  // Author (add extraction)
  this.field3 = field3;  // Type
  this.field4 = field4;  // Rating (add extraction)
  // ... rest
}
```

### Filtering Content

Add filters to search or main page:

```javascript
// Filter by genre
dataArray = dataArray.filter(novel => 
  novel.description.includes('Fantasy')
);

// Filter by status
dataArray = dataArray.filter(novel => 
  novel.field1 === 'Completed'
);

// Sort by title
dataArray.sort((a, b) => a.title.localeCompare(b.title));
```

## Troubleshooting Common Issues

### Issue: Module Won't Load

**Symptoms**: Error when importing JSON  
**Causes**:
- Invalid JSON syntax
- Missing required fields
- Incorrect data types

**Solutions**:
1. Validate JSON: [jsonlint.com](https://jsonlint.com/)
2. Check required fields in `moduleInfo`
3. Verify all arrays and objects are properly closed

### Issue: No Data Extracted

**Symptoms**: Empty results on all pages  
**Causes**:
- Cloudflare blocking requests
- Website structure changed
- JavaScript not executing

**Solutions**:
1. Enable browser mode in module creator
2. Update CSS selectors
3. Check JavaScript console for errors

### Issue: Incomplete Chapter List

**Symptoms**: Only 10-20 chapters shown, but novel has 1000+  
**Causes**:
- AJAX request not triggered
- Info2.html not processing response
- Novel ID not extracted

**Solutions**:
1. Verify `#rating[data-novel-id]` exists
2. Check AJAX URL construction
3. Inspect Info2.html JavaScript logic

### Issue: Broken Images

**Symptoms**: Images don't load or show broken icon  
**Causes**:
- Missing Referer header
- Incorrect URL construction
- Hotlink protection

**Solutions**:
1. Add Referer header to image requests
2. Verify image URL is absolute (starts with `https://`)
3. Check if images load in browser directly

### Issue: Ad Content in Chapters

**Symptoms**: Chapter text contains ad scripts  
**Causes**:
- Ad filtering not working
- New ad format

**Solutions**:
1. Update `replaceAll()` patterns
2. Add more ad script patterns to filter
3. Use regex for flexible matching

## Best Practices

### Performance

1. **Minimize Requests**: Batch data extraction
2. **Cache Images**: Store covers locally
3. **Lazy Load**: Load chapters on-demand
4. **Pagination**: Limit results per page

### Reliability

1. **Error Handling**: Add try-catch blocks
2. **Fallback Selectors**: Use multiple selector options
3. **Validation**: Check data before returning
4. **Logging**: Add console logs for debugging

### User Experience

1. **Loading States**: Show spinners during AJAX
2. **Error Messages**: Display helpful error text
3. **Empty States**: Handle no results gracefully
4. **Offline Mode**: Cache read chapters

## Resources

- **Module Creator**: https://module-creator.com/
- **Ketsu GitHub**: https://github.com/OffsetParts/KetsuModules
- **Example Modules**: https://github.com/OffsetParts/KetsuModules/tree/master/Modules
- **Documentation**: Check Ketsu app help section

## Support

If you encounter issues:

1. **Check README.md**: Review technical details
2. **Test Selectors**: Use browser DevTools
3. **Validate JSON**: Use online validators
4. **Compare Examples**: Look at other modules
5. **Report Issues**: Contact module creator support

---

**Happy Reading! 📚**
