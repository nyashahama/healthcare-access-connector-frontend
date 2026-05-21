import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
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
console.log(`Processing ${files.length} files...`);

let totalFixes = 0;

for (const filePath of files) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  let original = content;

  // 1. Fix navigate() calls: navigate("/path") -> navigate({ to: "/path" })
  // But not if it's already navigate({ ... })
  // Match patterns like:
  //   navigate("/patient/dashboard");
  //   navigate(`/patient/community/post/${postId}`);
  // But not: navigate({ to: "/path" })
  content = content.replace(
    /navigate\(\s*(["'`])(\/[^"'`]*?)\1\s*\)/g,
    'navigate({ to: $1$2$1 })'
  );
  // Handle template literals: navigate(`/path/${var}`)
  // These are trickier - we need to keep the template literal
  content = content.replace(
    /navigate\(\s*(`[^`]*`)\s*\)/g,
    'navigate({ to: $1 })'
  );

  // Note: We also have navigate(${variable}) patterns
  // This needs to be handled case by case

  // 2. Add props interfaces for components with destructured props
  // Pattern: ({ isOpen, onClose, ... }) => { with no type annotation
  // We'll handle the most common ones with a generic approach
  
  // 3. Add React.FormEvent type to form submit handlers
  // Pattern: (e) => { ... e.preventDefault() ... }
  // These need: (e: React.FormEvent) => {
  // We'll handle with a targeted fix in the next pass
  
  // 4. Add type annotation for useState that has complex initial values
  // Already partially handled - let's check for more patterns

  // 5. Fix implicit any in useRef
  content = content.replace(
    /const\s+(\w+)\s*=\s*useRef\(\s*null\s*\)/g,
    'const $1 = useRef<any>(null)'
  );

  // 6. Fix map() callback parameters: .map((item) =>  without type
  // These will generate errors but the array type should be inferrable
  // We'll let tsc guide us
  
  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    modified = true;
    totalFixes++;
  }
}

console.log(`Fixed ${totalFixes} files`);
