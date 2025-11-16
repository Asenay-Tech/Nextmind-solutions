const fs = require('fs');
const path = require('path');

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function setNestedKey(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function getNestedKey(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}

try {
  console.log('Validating translation files...\n');
  
  // Read and parse JSON files
  const enPath = path.join(__dirname, '../messages/en.json');
  const dePath = path.join(__dirname, '../messages/de.json');
  
  const enContent = fs.readFileSync(enPath, 'utf8');
  const deContent = fs.readFileSync(dePath, 'utf8');
  
  let enJson, deJson;
  
  try {
    enJson = JSON.parse(enContent);
    console.log('✓ en.json is valid JSON');
  } catch (e) {
    console.error('✗ en.json JSON parse error:', e.message);
    process.exit(1);
  }
  
  try {
    deJson = JSON.parse(deContent);
    console.log('✓ de.json is valid JSON');
  } catch (e) {
    console.error('✗ de.json JSON parse error:', e.message);
    console.error(`  Line/position info: ${e.message}`);
    process.exit(1);
  }
  
  // Get all keys from both files
  const enKeys = getAllKeys(enJson);
  const deKeys = getAllKeys(deJson);
  
  console.log(`\nFound ${enKeys.length} keys in en.json`);
  console.log(`Found ${deKeys.length} keys in de.json`);
  
  // Find missing keys
  const missingKeys = enKeys.filter(key => !deKeys.includes(key));
  const extraKeys = deKeys.filter(key => !enKeys.includes(key));
  
  if (missingKeys.length > 0) {
    console.log(`\n⚠️  Found ${missingKeys.length} missing keys in de.json:`);
    missingKeys.slice(0, 20).forEach(key => {
      const enValue = getNestedKey(enJson, key);
      console.log(`  - ${key}: "${enValue}"`);
      
      // Add missing key with English value as fallback
      setNestedKey(deJson, key, enValue);
    });
    
    if (missingKeys.length > 20) {
      console.log(`  ... and ${missingKeys.length - 20} more`);
    }
    
    // Write updated de.json
    const updatedDeContent = JSON.stringify(deJson, null, 2) + '\n';
    fs.writeFileSync(dePath, updatedDeContent, 'utf8');
    console.log('\n✓ Updated de.json with missing keys (using English fallback)');
  } else {
    console.log('\n✓ All keys from en.json exist in de.json');
  }
  
  if (extraKeys.length > 0) {
    console.log(`\nℹ️  Found ${extraKeys.length} extra keys in de.json (not in en.json)`);
    extraKeys.slice(0, 10).forEach(key => console.log(`  - ${key}`));
  }
  
  console.log('\n✓ Validation complete!');
  
} catch (error) {
  console.error('✗ Validation error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

