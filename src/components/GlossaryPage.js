import React, { useState, useEffect } from 'react';
import styles from './GlossaryPage.module.css';
import glossaryTerms from '../data/glossary';
import ReactMarkdown from 'react-markdown';

export default function GlossaryPage() {
  // Group terms by first letter
  const [groupedTerms, setGroupedTerms] = useState({});
  const [activeLetter, setActiveLetter] = useState(null);
  
  useEffect(() => {
    // Sort alphabetically
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
    
    // Check for hash in URL to directly navigate to a term
    if (window.location.hash) {
      const termSlug = window.location.hash.substring(1);
      const term = glossaryTerms.find(t => t.slug === termSlug);
      if (term) {
        const letter = term.term.charAt(0).toUpperCase();
        setActiveLetter(letter);
        
        // Give the DOM time to render before scrolling
        setTimeout(() => {
          const element = document.getElementById(termSlug);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // Set first available letter as active
      const letters = Object.keys(grouped).sort();
      if (letters.length > 0) {
        setActiveLetter(letters[0]);
      }
    }
  }, []);

  // Update active letter on scroll
  useEffect(() => {
    const handleScroll = () => {
      const letterSections = document.querySelectorAll('[id^="letter-"]');
      
      // Find the letter section closest to the top of the viewport
      let closestSection = null;
      let closestDistance = Infinity;
      
      letterSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });
      
      if (closestSection) {
        const letter = closestSection.id.split('-')[1];
        setActiveLetter(letter);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            onClick={() => {
              setActiveLetter(letter);
              const element = document.getElementById(`letter-${letter}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
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
                  <dt className={styles.term}>
                    <a href={`#${item.slug}`} className={styles.termLink}>
                      {item.term}
                    </a>
                  </dt>
                  <dd className={styles.definition}>
                    <ReactMarkdown>{item.definition}</ReactMarkdown>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
