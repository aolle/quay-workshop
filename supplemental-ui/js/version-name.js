document.addEventListener('DOMContentLoaded', () => {
  const version = 'v3.15';
  const toggle = document.querySelector('.version-menu-toggle');

  if (toggle && version && toggle.textContent.trim() === 'main') {
    toggle.textContent = version;
  }
});
