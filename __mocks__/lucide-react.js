
const React = require('react');

// Create a proxy to mock all lucide-react exports.
// This will return a dummy React component for any icon.
const lucideReact = new Proxy({}, {
  get: function(target, prop) {
    return (props) => React.createElement('svg', { ...props, 'data-testid': `mock-icon-${String(prop)}` });
  },
});

module.exports = lucideReact;
