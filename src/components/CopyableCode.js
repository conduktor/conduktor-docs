// src/components/CopyableCode.js
import React, { useState } from 'react';
import styles from './CopyableCode.module.css';

const CopyableCode = ({ children, language = 'bash', inline = false }) => {
  const [copied, setCopied] = useState(false);

  // Extract text content from children (handles both string and React elements)
  const getTextContent = (element) => {
    if (typeof element === 'string') {
      return element;
    }
    if (typeof element === 'number') {
      return element.toString();
    }
    if (React.isValidElement(element)) {
      return getTextContent(element.props.children);
    }
    if (Array.isArray(element)) {
      return element.map(getTextContent).join('');
    }
    return '';
  };

  const copyToClipboard = async () => {
    const textToCopy = getTextContent(children).trim();
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (inline) {
    return (
      <span className={styles.inlineContainer}>
        <code className={styles.inlineCode}>{children}</code>
        <button 
          className={styles.inlineCopyButton}
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {copied ? '✓' : '📋'}
        </button>
      </span>
    );
  }

  return (
    <div className={styles.codeContainer}>
      <pre className={styles.codeBlock}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
      <button 
        className={styles.copyButton}
        onClick={copyToClipboard}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default CopyableCode;
