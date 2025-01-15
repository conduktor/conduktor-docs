import Head from '@docusaurus/Head';
import Layout from '@theme-original/Layout';
import React from 'react';
import { useLocation } from '@docusaurus/router';

function Banner() {
  const location = useLocation();
  const showBanner = location.pathname.includes('/desktop/');

  if (!showBanner) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0A343C', // Dark greenish background
        color: '#FFFFFF', // White text
        textAlign: 'center', // Center align content
        padding: '1rem', // Padding for breathing space
        zIndex: 1000, // Ensure it stays above other elements
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
      }}
    >
      <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
        We're sunsetting Conduktor Desktop at the end of 2025.{' '}
        <a
          href="https://conduktor.io/desktop"
          style={{
            color: '#FFFFFF', // White text for link
            textDecoration: 'underline', // Underline for emphasis
            fontWeight: 'bold', // Make it stand out
          }}
        >
          Read more →
        </a>
      </p>
    </div>
  );
}

export default function LayoutWrapper(props) {
  const location = useLocation();
  const showBanner = location.pathname.includes('/desktop/');

  return (
    <>
      <Head>
        <meta property="og:image" content="/assets/images/og.png" />
      </Head>
      <Banner />
      <div style={{ paddingTop: showBanner ? '4rem' : '0' }}>
        <Layout {...props} />
      </div>
    </>
  );
}
