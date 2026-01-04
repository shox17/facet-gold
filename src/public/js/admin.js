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

// ============================================
// Modal System - Reusable Modal Controller
// ============================================
(function() {
  'use strict';

  // Store reference to the trigger button for focus return
  let lastTriggerButton = null;

  // Open modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Store trigger button
    const trigger = document.querySelector(`[data-modal-open="${modalId}"]`);
    if (trigger) {
      lastTriggerButton = trigger;
    }

    // Prevent body scroll
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Show modal
    modal.classList.add('is-open');

    // Focus first input in form (for accessibility)
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) {
      setTimeout(() => {
        firstInput.focus();
      }, 100);
    }
  }

  // Close modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Add closing class for animation
    modal.classList.add('is-closing');
    modal.classList.remove('is-open');

    // Restore body scroll
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    // Reset form if it exists
    const form = modal.querySelector('form');
    if (form) {
      form.reset();
    }

    // Remove closing class after animation
    const handleTransitionEnd = () => {
      modal.classList.remove('is-closing');
      modal.removeEventListener('transitionend', handleTransitionEnd);
    };
    modal.addEventListener('transitionend', handleTransitionEnd);

    // Return focus to trigger button
    if (lastTriggerButton) {
      setTimeout(() => {
        lastTriggerButton.focus();
        lastTriggerButton = null;
      }, 100);
    }
  }

  // Handle modal open triggers
  document.addEventListener('click', function(event) {
    const openTrigger = event.target.closest('[data-modal-open]');
    if (openTrigger) {
      event.preventDefault();
      const modalId = openTrigger.getAttribute('data-modal-open');
      openModal(modalId);
    }

    // Handle modal close triggers
    const closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      event.preventDefault();
      const modal = closeTrigger.closest('[data-modal]');
      if (modal) {
        closeModal(modal.id);
      }
    }

    // Handle backdrop click (close modal)
    if (event.target.classList.contains('fg-modal-backdrop')) {
      const modal = event.target;
      closeModal(modal.id);
    }
  });

  // Handle ESC key to close modal
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      const openModal = document.querySelector('.fg-modal-backdrop.is-open');
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });
})();


