export const pageview = () => {
  window.fbq('track', 'PageView');
};

export const event = (name, options = {}) => {
  window.fbq('track', name, options);
};