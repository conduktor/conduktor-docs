import React, { useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { createPortal } from 'react-dom';
import './SearchInput.css'; // Add some custom styles

export default function SearchInput({ compact }) {
  const searchButtonRef = useRef(null);
  const {siteConfig} = useDocusaurusContext();
  const {algolia} = siteConfig.themeConfig;

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !algolia) return;
    
    // Dynamically import DocSearch
    import('@docsearch/js').then(({ default: docsearch }) => {
      // Initialize DocSearch
      docsearch({
        appId: algolia.appId,
        apiKey: algolia.apiKey,
        indexName: algolia.indexName,
        container: '#custom-docsearch',
        debug: process.env.NODE_ENV !== 'production',
      });
    });
  }, [algolia]);

  return (
    <>
      <button 
        ref={searchButtonRef}
        className={`custom-search-button ${compact ? 'compact' : ''}`}
        onClick={() => {
          // Trigger the DocSearch modal
          document.querySelector('.DocSearch-Button')?.click();
        }}
      >
        {/* Search Icon */}
        <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20">
          <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
        <span>Search Conduktor docs</span>
      </button>
      {createPortal(
        <div id="custom-docsearch" style={{ display: 'none' }}></div>,
        document.body
      )}
    </>
  );
}