import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';

function product(props) {
  return (
    <div style={{border: '1px solid #072024', padding: 10}}>
      <h5 style={{color: ' #072024', fontSize: 30}}>{props.title}</h5>
      <div>{props.children}</div>
    </div>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,

  // Add all your custom admonition types here...
  // You can also override the default ones if you want
  'product': product,
};

export default AdmonitionTypes;