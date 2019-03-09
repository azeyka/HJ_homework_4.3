'use strict';
function createElement(node) {  
  let el = document.createElement(node.name || 'div');
  
  if (!((node.props === undefined) || (node.props === null))) {
    Object.keys(node.props).forEach(i => el.setAttribute(i, node.props[i]));
  };
  
  if (node.childs instanceof Array) {
    node.childs.forEach(child => {   
      if (typeof child === 'string') {
        el.textContent = child;
      } else if (typeof child === 'object') {
        el.appendChild(createElement(child));
      };
    });
  };
  
  return el
} 