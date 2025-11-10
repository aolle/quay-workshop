document.addEventListener('DOMContentLoaded', () => {
  const version = '3.15';
  const toggle = document.querySelector('.version-menu-toggle');
  
  if (toggle && version && toggle.textContent.trim() === 'main') {
    toggle.textContent = version;
  }
});
