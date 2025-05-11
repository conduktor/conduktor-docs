import React from 'react';

const LABEL_STYLES = {
  TF: { backgroundColor: '#F8F1EE', color: '#7D5E54', text: 'Terraform' },
  API: { backgroundColor: '#E8F1FA', color: '#2E6EA6', text: 'API' },
  CLI: { backgroundColor: '#FCEFFC', color: '#9C2BAD', text: 'CLI' },
  UI: { backgroundColor: '#F6F4FF', color: '#422D84', text: 'Console UI' },
  FullLabelSupport: { backgroundColor: '#E6F4EA', color: '#1B7F4B', text: 'Full label support' },
  PartialLabelSupport: { backgroundColor: '#FFF8E1', color: '#B26A00', text: 'Partial label support (no UI yet)' },
  MissingLabelSupport: { backgroundColor: '#FADBD8', color: '#922B21', text: 'Label support upcoming' },

  
  AppToken: {
    backgroundColor: '#DCE8F7', // light blue
    color: '#2E6EA6',           // medium blue
    text: 'Application API key',
  },
  AdminToken: {
    backgroundColor: '#D0E0F0', // slightly deeper blue background
    color: '#1A4971',           // darker blue text for restriction indication
    text: 'Admin API key',
  },

 // Schema registry labels 
  PerSubject: { backgroundColor: '#a5d8ff', color: '#1971c2', text: 'Per subject' },
  Global: { backgroundColor: '#ffc9c9', color: '#e03131', text: 'Global' },
};

export default function Label({ type }) {
  const style = LABEL_STYLES[type];

  if (!style) {
    return <span style={{ color: 'red' }}>Unknown label: {type}</span>;
  }

  return (
    <span
      style={{
        backgroundColor: style.backgroundColor,
        borderRadius: '4px',
        color: style.color,
        padding: '0.2rem 0.5rem',
        fontWeight: '500',
      }}
    >
      {style.text}
    </span>
  );
}