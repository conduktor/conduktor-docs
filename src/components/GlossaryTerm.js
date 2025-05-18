import React from 'react';
import Link from '@docusaurus/Link';
import styles from './GlossaryTerm.module.css';
import glossaryData from '@site/src/data/glossary';

export default function GlossaryTerm({children}) {
  const searchTerm = children.toLowerCase().trim();
  
  // First try exact match
  let term = glossaryData.find(item => 
    item.term.toLowerCase() === searchTerm
  );
  
  // If no exact match, try singular/plural variations
  if (!term) {
    // Remove 's' from end if present
    const singularTerm = searchTerm.endsWith('s') ? searchTerm.slice(0, -1) : searchTerm;
    // Add 's' to end if not present
    const pluralTerm = searchTerm.endsWith('s') ? searchTerm : searchTerm + 's';
    
    term = glossaryData.find(item => {
      const itemTerm = item.term.toLowerCase();
      return itemTerm === singularTerm || itemTerm === pluralTerm;
    });
  }
  
  if (!term) {
    console.log(`❌ Term not found: "${children}"`);
    return <span>{children}</span>;
  }
  
  return (
    <span 
      className={styles.glossaryTerm} 
      data-tooltip={term.tooltip || term.definition}
      title={term.tooltip || term.definition}
    >
      {children}
    </span>
  );
}
