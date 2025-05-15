import React from 'react';
import Link from '@docusaurus/Link';
import styles from './GlossaryTerm.module.css';
import glossaryTerms from '../data/glossary';

export default function GlossaryTerm({ children }) {
  // Find term definition
  const term = glossaryTerms.find(
    t => t.term.toLowerCase() === children.toLowerCase()
  );

  // If term not found in glossary, just render text
  if (!term) {
    return <span>{children}</span>;
  }

  return (
    <Link 
      to={`/guides/conduktor-concepts/glossary#${term.slug}`}
      className={styles.glossaryTerm} 
      title={term.definition}
    >
      {children}
    </Link>
  );
}
