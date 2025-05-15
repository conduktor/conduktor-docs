const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });

// Path to the glossary file
const GLOSSARY_FILE = path.join(__dirname, '../src/data/glossary.js');

function readGlossary() {
  // Read the current glossary file
  const glossaryContent = fs.readFileSync(GLOSSARY_FILE, 'utf8');
  
  // Extract the terms array from the file
  const termsMatch = glossaryContent.match(/const glossaryTerms = (\[[\s\S]*?\]);/);
  if (!termsMatch || !termsMatch[1]) {
    console.error('Could not parse glossary file');
    process.exit(1);
  }
  
  let terms;
  try {
    // Safely evaluate the terms array
    terms = eval(termsMatch[1]);
  } catch (e) {
    console.error('Error parsing terms:', e);
    process.exit(1);
  }
  
  return { terms, fullContent: glossaryContent };
}

function writeGlossary(terms) {
  // Format the terms with proper indentation
  const formattedTerms = JSON.stringify(terms, null, 2)
    .replace(/\n/g, '\n  ')
    .replace(/^]$/m, ']');
  
  // Create the new file content
  const newContent = `const glossaryTerms = ${formattedTerms};

export default glossaryTerms;`;
  
  // Write back to the file
  fs.writeFileSync(GLOSSARY_FILE, newContent, 'utf8');
}

function addTerm() {
  const { terms } = readGlossary();
  
  console.log('=== Add New Glossary Term ===');
  
  const term = prompt('Term: ');
  if (!term) {
    console.log('Term cannot be empty');
    return;
  }
  
  // Check if term already exists
  if (terms.some(t => t.term.toLowerCase() === term.toLowerCase())) {
    console.log(`Term "${term}" already exists in the glossary`);
    return;
  }
  
  const definition = prompt('Definition: ');
  if (!definition) {
    console.log('Definition cannot be empty');
    return;
  }
  
  // Create slug from term
  const slug = term.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
  
  // Add the new term
  terms.push({
    term,
    definition,
    slug,
  });
  
  // Sort terms alphabetically
  terms.sort((a, b) => a.term.localeCompare(b.term));
  
  // Write back to file
  writeGlossary(terms);
  
  console.log(`Term "${term}" successfully added to the glossary`);
}

function listTerms() {
  const { terms } = readGlossary();
  
  console.log('=== Current Glossary Terms ===');
  terms.forEach((term, index) => {
    console.log(`${index + 1}. ${term.term}`);
  });
}

function editTerm() {
  const { terms } = readGlossary();
  
  listTerms();
  
  const termIndex = parseInt(prompt('Enter term number to edit: ')) - 1;
  if (isNaN(termIndex) || termIndex < 0 || termIndex >= terms.length) {
    console.log('Invalid term number');
    return;
  }
  
  const term = terms[termIndex];
  console.log(`Editing: ${term.term}`);
  console.log(`Current definition: ${term.definition}`);
  
  const newDefinition = prompt('New definition (leave empty to keep current): ');
  if (newDefinition) {
    term.definition = newDefinition;
    writeGlossary(terms);
    console.log('Definition updated');
  }
}

function removeTerm() {
  const { terms } = readGlossary();
  
  listTerms();
  
  const termIndex = parseInt(prompt('Enter term number to remove: ')) - 1;
  if (isNaN(termIndex) || termIndex < 0 || termIndex >= terms.length) {
    console.log('Invalid term number');
    return;
  }
  
  const confirm = prompt(`Are you sure you want to delete "${terms[termIndex].term}"? (y/n): `);
  if (confirm.toLowerCase() === 'y') {
    terms.splice(termIndex, 1);
    writeGlossary(terms);
    console.log('Term removed');
  }
}

// Main menu
function showMenu() {
  console.log('\n=== Glossary Manager ===');
  console.log('1. Add a new term');
  console.log('2. List all terms');
  console.log('3. Edit a term');
  console.log('4. Remove a term');
  console.log('0. Exit');
  
  const choice = prompt('Select an option: ');
  
  switch (choice) {
    case '1':
      addTerm();
      break;
    case '2':
      listTerms();
      break;
    case '3':
      editTerm();
      break;
    case '4':
      removeTerm();
      break;
    case '0':
      console.log('Goodbye!');
      process.exit(0);
    default:
      console.log('Invalid option');
  }
  
  showMenu();
}

// Start the program
showMenu();
