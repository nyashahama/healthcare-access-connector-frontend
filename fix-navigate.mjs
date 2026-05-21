import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllTsxFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const s = statSync(fullPath);
    if (s.isDirectory()) {
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles('src/views');
let fixes = 0;

for (const filePath of files) {
  let content = readFileSync(filePath, 'utf-8');
  let original = content;

  // Fix: navigate(variable) -> navigate({ to: variable })
  // But be careful not to match navigate({ already
  content = content.replace(
    /navigate\(\s*([a-zA-Z_$][\w$]*)\s*\)/g,
    'navigate({ to: $1 })'
  );

  // Fix: navigate(condition ? "a" : "b") 
  // Harder to do with regex, we'll handle manually if needed

  // Fix: navigate(-1) -> window.history.back()
  content = content.replace(
    /navigate\(\s*-1\s*\)/g,
    'window.history.back()'
  );
  
  // Fix: navigate(`...`) with trailing comma (already has options)
  // navigate(`/path?x=${y}`, { state: ... }) -> navigate({ to: `/path?x=${y}`, state: ... })
  content = content.replace(
    /navigate\(\s*(`[^`]*`)\s*,\s*(\{)/g,
    'navigate({ to: $1, $2'
  );
  
  // Fix: navigate("/path", { state: ... }) -> navigate({ to: "/path", state: ... })
  content = content.replace(
    /navigate\(\s*(["'])(\/[^"']*?)\1\s*,\s*(\{)/g,
    'navigate({ to: $1$2$1, $3'
  );

  // Add type annotation for .map() item parameter (common error source)
  // Handle: .map((item) => -> .map((item: any) =>
  // This is a stopgap - better inference is ideal but this gets us compilable
  // We'll rely on tsc errors and fix the remaining manually
  
  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    fixes++;
  }
}

console.log(`Fixed ${fixes} files`);
