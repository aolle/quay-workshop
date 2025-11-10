document.addEventListener('DOMContentLoaded', () => {
  const toolbar = document.querySelector('.toolbar');
  const version = toolbar?.dataset.quayVersion;
  const toggle = document.querySelector('.version-menu-toggle');
  
  if (toggle && version && toggle.textContent.trim() === 'main') {
    toggle.textContent = version;
  }
});
