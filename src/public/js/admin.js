// Admin Panel JavaScript
// Handle sidebar active state based on current URL

(function() {
  // Set active sidebar item based on current URL
  const currentPath = window.location.pathname;
  const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
  
  sidebarItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath === href) {
      item.classList.add('active');
    } else if (currentPath === '/admin' && href === '/admin/') {
      item.classList.add('active');
    } else if (currentPath.startsWith('/admin/product') && href === '/admin/product/all') {
      item.classList.add('active');
    } else if (currentPath.startsWith('/admin/user') && href === '/admin/user/all') {
      item.classList.add('active');
    }
  });
})();

// Toggle user dropdown menu
function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('user-dropdown');
  const menu = document.getElementById('user-menu');
  if (dropdown && menu && !dropdown.contains(event.target)) {
    menu.style.display = 'none';
  }
});


