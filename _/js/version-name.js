document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const version = body.dataset.quayVersion;
  const toggle = document.querySelector('.version-menu-toggle');
  
  if (toggle && toggle.textContent.trim() === 'main') {
    toggle.textContent = version;
  }
});
