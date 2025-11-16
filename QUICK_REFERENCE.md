# FreeWebNovel Module - Quick Reference

## 🚀 Quick Start

```bash
# 1. Upload to module-creator.com
Visit: https://module-creator.com/
Upload: moduleTemplate.json

# 2. Test the module
- Main Page: Browse featured novels
- Search: Try "martial peak"
- Info: Click any novel
- Chapter: Click any chapter

# 3. Export and use in Ketsu app
```

## 📋 Module Structure

```
moduleTemplate.json          # Main configuration
├── moduleInfo              # Module metadata
├── global                  # Global settings
├── mainPage[]             # Homepage scraping
├── search[]               # Search functionality
├── info[]                 # Novel info (2 stages)
├── chapters[]             # Chapter reading
└── moduleResolvers[]      # (empty)
```

## 🔍 CSS Selectors Cheat Sheet

### Main Page
```javascript
.index-novel                    // Novel sections container
.index-novel .item             // Hot novel items
.index-novel .row              // New chapter items
#index-novel-completed         // Completed novels section
.col-md-2                      // Completed novel items
```

### Search
```javascript
#list-page                     // Search results container
.list-novel                    // Novel list wrapper
.row                          // Individual result
.novel-title                  // Novel title
.chr-text                     // Chapter count
```

### Info Page
```javascript
h3.tit                        // Novel title
.det-desc                     // Description
.book img                     // Cover image
.info-meta li                 // Metadata items
#rating[data-novel-id]        // Novel ID for AJAX
ul.ul-list5 li                // Initial chapters
.panel-body li                // AJAX loaded chapters
```

### Chapter
```javascript
.txt-c                        // Chapter content
#chapter-content              // Alternative selector
```

## 🌐 URL Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Home | `https://freewebnovel.com/` | - |
| Search | `https://freewebnovel.com/search/?searchkey=<query>` | `?searchkey=martial+peak` |
| Novel | `https://freewebnovel.com/<slug>.html` | `/martial-peak.html` |
| Chapter | `https://freewebnovel.com/<novel>/<chapter>.html` | `/martial-peak/chapter-1.html` |
| AJAX | `https://freewebnovel.com/ajax/chapter-archive?novelId=<id>` | `?novelId=12345` |

## 🎨 Layout Types

### Cell Designs
- **Special1-3**: Featured content
- **small1-2**: Compact
- **normal1-7**: Standard
- **wide1-11**: Wide

### Default Layouts
- **doublets**: 2 columns
- **triplets**: 3 columns
- **longDoublets**: Tall 2 columns
- **longTriplets**: Tall 3 columns
- Modifiers: `Full`, `Double`, `Constant`, `List`, `Streched`

### Paging
- **leading**: Start
- **centered**: Center
- **none**: No pagination

### Orientation
- **horizontal**: Horizontal scroll
- **vertical**: Vertical scroll

## 📦 Data Structures

### MainPage Output
```javascript
{
  cellDesing: "Special3",
  orientation: "horizontal",
  defaultLayout: "triplets",
  paging: "leading",
  section: { sectionName: "Hot", separator: true },
  layout: Layout | null,
  data: Data[]
}
```

### Search Output
```javascript
{
  cellDesing: "wide8",
  orientation: "vertical",
  data: Data[]
}
```

### Info Output
```javascript
{
  image: ModuleRequest,
  title: string,
  description: string,
  genres: string[],
  field1: "Status",
  field2: "",
  field3: "Light Novel",
  field4: "Chapters: 1234",
  chapters: Chapter[]
}
```

### Chapter Output
```javascript
{
  text: { text: string }
}
```

## 🔧 Common Functions

### ModuleRequest
```javascript
new ModuleRequest(url, method, headers, httpBody)
// Example:
new ModuleRequest('https://freewebnovel.com/', 'get', [], null)
```

### KeyValue (Headers)
```javascript
new KeyValue(key, value)
// Example:
new KeyValue('Referer', 'https://freewebnovel.com/')
```

### Chapter
```javascript
new Chapter(chapName, link, openInWebView)
// Example:
new Chapter('Chapter 1', linkRequest, false)
```

### Data
```javascript
new Data(image, title, description, field1, field2, field3, field4, isChapter, link, openInWebView)
```

## 🛠️ JavaScript Helpers

### Get Metadata
```javascript
function getStuff(array, match) {
  for (var x = 0; x < array.length; x++) {
    let data = array[x].innerText;
    if (data.includes(match)) {
      return data.replace(match, '').trim();
    }
  }
}

// Usage:
let genres = getStuff(metaItems, 'Genre:').split(', ');
let status = getStuff(metaItems, 'Status:');
```

### Replace All
```javascript
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

// Usage:
text = replaceAll(text, '(adsbygoogle = window.adsbygoogle || []).push({});', '');
```

### Shuffle Array
```javascript
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
```

## 🐛 Troubleshooting

### 403 Forbidden
```
Problem: Cloudflare blocking
Solution: Enable browser mode in module creator
```

### Missing Chapters
```
Problem: AJAX not loading
Solution: Check novel ID extraction and Info2.html
```

### Broken Images
```
Problem: Hotlink protection
Solution: Add Referer header to requests
```

### Ad Content
```
Problem: Ads in chapter text
Solution: Filter with replaceAll()
```

## 📝 Testing Checklist

- [ ] Main page loads with 3+ sections
- [ ] Search returns results for "martial peak"
- [ ] Novel info shows cover, title, description
- [ ] Chapter list loads completely (may take 2-3s)
- [ ] Chapter content is clean (no ads)
- [ ] Images load correctly
- [ ] Links are absolute URLs
- [ ] Genres are parsed as array
- [ ] Status is extracted correctly

## 🔗 Important Links

- **Module Creator**: https://module-creator.com/
- **Ketsu Modules**: https://github.com/OffsetParts/KetsuModules
- **Website**: https://freewebnovel.com/
- **JSON Validator**: https://jsonlint.com/

## 💡 Pro Tips

1. **Test in browser first**: Use DevTools console to test selectors
2. **Check Network tab**: Monitor AJAX requests
3. **Validate JSON**: Always validate before uploading
4. **Use fallbacks**: Add alternative selectors for reliability
5. **Cache data**: Store frequently accessed data locally
6. **Handle errors**: Add try-catch blocks in JavaScript
7. **Log debug info**: Use console.log() during development
8. **Test edge cases**: Empty results, long titles, special characters

## 📊 Module Stats

- **Pages**: 4 (Main, Search, Info, Chapters)
- **Selectors**: 15+
- **JavaScript**: ~5KB total
- **Layouts**: 8 different configurations
- **Cell Designs**: 4 types used
- **AJAX Requests**: 1 (chapter archive)

## 🎯 Key Features

✅ Multi-section homepage  
✅ Keyword search  
✅ Complete chapter lists via AJAX  
✅ Clean chapter text extraction  
✅ Genre and status parsing  
✅ Image loading with Referer  
✅ Responsive layouts  
✅ Ad filtering  

## 📱 Ketsu App Integration

```
1. Open Ketsu → Settings → Modules
2. Add Module → Import JSON
3. Select moduleTemplate.json
4. Module appears in source list
5. Browse and read novels
```

## 🔄 Update Process

```
1. Modify HTML files or moduleTemplate.json
2. Run: node validate_module.js
3. Fix any errors/warnings
4. Test in module-creator.com
5. Export updated JSON
6. Re-import to Ketsu app
```

---

**Version**: 1.0  
**Last Updated**: November 16, 2025  
**Compatibility**: Ketsu Module System v1.0+
