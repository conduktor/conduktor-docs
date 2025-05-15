import React, { useState, useEffect } from 'react';
import styles from './GlossaryPage.module.css';
import glossaryTerms from '../data/glossary';

export default function GlossaryPage() {
  // Group terms by first letter
  const [groupedTerms, setGroupedTerms] = useState({});
  const [activeLetter, setActiveLetter] = useState(null);
  
  useEffect(() => {
    // Sort terms alphabetically
    const sortedTerms = [...glossaryTerms].sort((a, b) => 
      a.term.localeCompare(b.term)
    );
    
    // Group by first letter
    const grouped = sortedTerms.reduce((acc, term) => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(term);
      return acc;
    }, {});
    
    setGroupedTerms(grouped);
    // Set first available letter as active
    const letters = Object.keys(grouped).sort();
    if (letters.length > 0) {
      setActiveLetter(letters[0]);
    }
  }, []);

  // Get all available letters
  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className={styles.glossaryContainer}>
      {/* Alphabet navigation */}
      <div className={styles.alphabetNav}>
        {letters.map(letter => (
          <button
            key={letter}
            className={`${styles.letterButton} ${activeLetter === letter ? styles.activeLetter : ''}`}
            onClick={() => setActiveLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Glossary content */}
      <div className={styles.glossaryContent}>
        {letters.map(letter => (
          <div 
            key={letter} 
            id={`letter-${letter}`}
            className={`${styles.letterSection} ${activeLetter === letter ? styles.activeSection : styles.inactiveSection}`}
          >
            <h2 className={styles.letterHeading}>{letter}</h2>
            <dl className={styles.termsList}>
              {groupedTerms[letter]?.map(item => (
                <div key={item.slug} className={styles.termEntry} id={item.slug}>
                  <dt className={styles.term}>{item.term}</dt>
                  <dd className={styles.definition}>{item.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
