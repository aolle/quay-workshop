document.addEventListener('DOMContentLoaded', () => {
  const version = 'v3.15';
  
  const toggle = document.querySelector('.version-menu-toggle');
  if (toggle && toggle.textContent.trim() === 'main') {
    toggle.textContent = version;
  }
  
  const links = document.querySelectorAll('.page-versions .version');
  links.forEach(link => {
    if (link.textContent.trim() === 'main') {
      link.textContent = version;
    }
  });
});