#!/usr/bin/env node

/**
 * FreeWebNovel Module Validator
 * Validates the module structure and checks for common issues
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Validation functions
function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    logSuccess(`Valid JSON: ${path.basename(filePath)}`);
    return json;
  } catch (error) {
    logError(`Invalid JSON in ${path.basename(filePath)}: ${error.message}`);
    return null;
  }
}

function validateModuleInfo(moduleInfo) {
  logSection('Validating Module Info');
  
  const requiredFields = [
    'moduleName',
    'moduleInitials',
    'moduleDesc',
    'developer',
    'moduleID',
    'moduleVersion',
    'moduleLenguage',
    'moduleType',
    'baseURL',
  ];

  let valid = true;

  requiredFields.forEach(field => {
    if (moduleInfo[field] !== undefined && moduleInfo[field] !== '') {
      logSuccess(`${field}: ${moduleInfo[field]}`);
    } else {
      logError(`Missing or empty: ${field}`);
      valid = false;
    }
  });

  // Check base URL format
  if (moduleInfo.baseURL && !moduleInfo.baseURL.startsWith('http')) {
    logWarning('baseURL should start with http:// or https://');
  }

  // Check module type
  if (moduleInfo.moduleType !== 'Text') {
    logWarning(`Module type is "${moduleInfo.moduleType}", expected "Text" for novels`);
  }

  return valid;
}

function validatePageSection(sectionName, section) {
  logSection(`Validating ${sectionName}`);

  if (!Array.isArray(section) || section.length === 0) {
    logError(`${sectionName} is not an array or is empty`);
    return false;
  }

  let valid = true;

  section.forEach((page, index) => {
    logInfo(`Checking ${sectionName}[${index}]...`);

    // Validate request
    if (!page.request) {
      logError('Missing request object');
      valid = false;
    } else {
      if (page.request.url !== undefined) {
        logSuccess(`Request URL: ${page.request.url || '(empty - will be set dynamically)'}`);
      }
      if (page.request.method) {
        logSuccess(`Request method: ${page.request.method}`);
      }
    }

    // Validate javascriptConfig
    if (!page.javascriptConfig) {
      logError('Missing javascriptConfig');
      valid = false;
    } else {
      logSuccess('JavaScript config present');
      if (page.javascriptConfig.javaScript && page.javascriptConfig.javaScript.length > 100) {
        logSuccess(`JavaScript code: ${page.javascriptConfig.javaScript.length} characters`);
      } else {
        logWarning('JavaScript code seems short or missing');
      }
    }

    // Validate output structure
    if (page.output !== undefined) {
      logSuccess('Output structure defined');
    }
  });

  return valid;
}

function validateHTMLFiles() {
  logSection('Validating HTML Files');

  const htmlFiles = [
    { path: './MainPage/MainPage.html', name: 'Main Page' },
    { path: './Search/Search.html', name: 'Search' },
    { path: './Info/Info.html', name: 'Info (Stage 1)' },
    { path: './Info/Info2.html', name: 'Info (Stage 2)' },
    { path: './Chapters/Chapters.html', name: 'Chapters' },
  ];

  let valid = true;

  htmlFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      const content = fs.readFileSync(file.path, 'utf8');
      
      logSuccess(`Found: ${file.name}`);
      
      // Check for key elements
      if (content.includes('ketsu-final-data')) {
        logSuccess('  - Contains ketsu-final-data element');
      } else {
        logWarning('  - Missing ketsu-final-data element');
      }

      if (content.includes('function') && content.includes('Output')) {
        logSuccess('  - Contains output functions');
      } else {
        logWarning('  - Missing output functions');
      }

      // Check file size
      const sizeKB = (content.length / 1024).toFixed(2);
      logInfo(`  - Size: ${sizeKB} KB`);

    } else {
      logError(`Missing: ${file.name} (${file.path})`);
      valid = false;
    }
  });

  return valid;
}

function validateSelectors(module) {
  logSection('Checking CSS Selectors in JavaScript');

  const selectorsToCheck = [
    { selector: '.index-novel', page: 'MainPage', description: 'Main page novel container' },
    { selector: '.item', page: 'MainPage', description: 'Hot novel items' },
    { selector: '#list-page', page: 'Search', description: 'Search results container' },
    { selector: '.novel-title', page: 'Search', description: 'Novel title in search' },
    { selector: '.info-meta', page: 'Info', description: 'Novel metadata' },
    { selector: '.det-desc', page: 'Info', description: 'Novel description' },
    { selector: 'h3.tit', page: 'Info', description: 'Novel title' },
    { selector: '.txt-c', page: 'Chapters', description: 'Chapter content' },
  ];

  selectorsToCheck.forEach(item => {
    const pageSection = module[item.page.toLowerCase()];
    if (pageSection && pageSection[0] && pageSection[0].javascriptConfig) {
      const jsCode = pageSection[0].javascriptConfig.javaScript;
      if (jsCode && jsCode.includes(item.selector)) {
        logSuccess(`${item.selector} - ${item.description}`);
      } else {
        logWarning(`${item.selector} not found in ${item.page} JavaScript`);
      }
    }
  });
}

function validateURLPatterns(module) {
  logSection('Validating URL Patterns');

  // Check search URL
  if (module.search && module.search[0]) {
    const searchURL = module.search[0].request.url;
    if (searchURL && searchURL.includes('<searched>')) {
      logSuccess(`Search URL pattern: ${searchURL}`);
    } else {
      logError('Search URL missing <searched> placeholder');
    }

    if (module.search[0].separator === '+') {
      logSuccess('Search separator: + (correct for spaces)');
    } else {
      logWarning(`Search separator: ${module.search[0].separator} (expected +)`);
    }
  }

  // Check base URL
  if (module.moduleInfo && module.moduleInfo.baseURL) {
    const baseURL = module.moduleInfo.baseURL;
    if (baseURL.endsWith('/')) {
      logSuccess(`Base URL: ${baseURL}`);
    } else {
      logWarning('Base URL should end with /');
    }
  }
}

function checkForCommonIssues(module) {
  logSection('Checking for Common Issues');

  // Check for ad filtering
  const chaptersJS = module.chapters && module.chapters[0] && module.chapters[0].javascriptConfig.javaScript;
  if (chaptersJS && chaptersJS.includes('adsbygoogle')) {
    logSuccess('Ad filtering code present in Chapters');
  } else {
    logWarning('No ad filtering detected - chapters may contain ads');
  }

  // Check for AJAX chapter loading
  const infoJS = module.info && module.info[0] && module.info[0].javascriptConfig.javaScript;
  if (infoJS && infoJS.includes('chapter-archive')) {
    logSuccess('AJAX chapter archive loading configured');
  } else {
    logWarning('AJAX chapter loading may not be configured');
  }

  // Check for Referer header
  if (infoJS && infoJS.includes('Referer')) {
    logSuccess('Referer header configured for requests');
  } else {
    logWarning('Referer header not found - images may not load');
  }

  // Check for URL construction
  if (infoJS && infoJS.includes('https://freewebnovel.com')) {
    logSuccess('Absolute URL construction present');
  } else {
    logWarning('URLs may not be constructed as absolute paths');
  }
}

function generateReport(module) {
  logSection('Module Summary');

  console.log(`
Module Name:     ${module.moduleInfo.moduleName}
Module ID:       ${module.moduleInfo.moduleID}
Version:         ${module.moduleInfo.moduleVersion}
Type:            ${module.moduleInfo.moduleType}
Language:        ${module.moduleInfo.moduleLenguage}
Base URL:        ${module.moduleInfo.baseURL}
Developer:       ${module.moduleInfo.developer}

Pages Configured:
  - Main Page:   ${module.mainPage ? '✓' : '✗'}
  - Search:      ${module.search ? '✓' : '✗'}
  - Info:        ${module.info ? '✓' : '✗'}
  - Chapters:    ${module.chapters ? '✓' : '✗'}

Resolvers:       ${module.moduleResolvers ? module.moduleResolvers.length : 0}
Helper Functions: ${module.helperFunctions ? module.helperFunctions.length : 0}
  `);
}

// Main validation
function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     FreeWebNovel Module Validator v1.0                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  // Validate moduleTemplate.json
  const module = validateJSON('./moduleTemplate.json');
  if (!module) {
    logError('\nValidation failed: Cannot parse moduleTemplate.json');
    process.exit(1);
  }

  // Run all validations
  const results = {
    moduleInfo: validateModuleInfo(module.moduleInfo),
    mainPage: validatePageSection('mainPage', module.mainPage),
    search: validatePageSection('search', module.search),
    info: validatePageSection('info', module.info),
    chapters: validatePageSection('chapters', module.chapters),
    htmlFiles: validateHTMLFiles(),
  };

  // Additional checks
  validateSelectors(module);
  validateURLPatterns(module);
  checkForCommonIssues(module);

  // Generate report
  generateReport(module);

  // Final result
  logSection('Validation Result');
  const allValid = Object.values(results).every(r => r);
  
  if (allValid) {
    logSuccess('✓ All validations passed!');
    logInfo('\nModule is ready to use with module-creator.com');
    logInfo('Upload moduleTemplate.json to https://module-creator.com/');
  } else {
    logWarning('⚠ Some validations failed or have warnings');
    logInfo('\nReview the issues above and fix them before using the module');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Run validator
if (require.main === module) {
  main();
}

module.exports = { validateJSON, validateModuleInfo, validatePageSection };
