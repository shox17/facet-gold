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

// ============================================
// Toast Notification System
// ============================================
(function() {
  'use strict';

  // Create toast container if it doesn't exist
  function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  // Show toast notification
  window.showToast = function(message, type = 'info', duration = 3000) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    
    const bgColor = type === 'info' ? '#e3c08d' : type === 'success' ? '#22c55e' : type === 'warning' ? '#fbbf24' : '#ef4444';
    
    toast.style.cssText = `
      background: ${bgColor};
      color: #0a0a0a;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      font-weight: 500;
      min-width: 280px;
      max-width: 400px;
      pointer-events: auto;
      transform: translateX(400px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
        ${type === 'info' ? '<path d="M10 10V14.1667M10 5.83333H10.0083M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
        ${type === 'success' ? '<path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
        ${type === 'warning' ? '<path d="M10 5.83333V10M10 14.1667H10.0083M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
        ${type === 'error' ? '<path d="M10 10L15 15M15 10L10 15M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
      </svg>
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: currentColor; cursor: pointer; padding: 4px; display: flex; align-items: center; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }, duration);
    }
  };
})();

// ============================================
// Topbar Button Functionality
// ============================================
(function() {
  'use strict';

  // Back button - Go to dashboard
  const backBtn = document.getElementById('topbar-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/admin/';
    });
  }

  // Notifications button
  const notificationsBtn = document.getElementById('topbar-notifications-btn');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof showToast === 'function') {
        showToast('No new notifications', 'info', 3000);
      } else {
        alert('Notifications feature is coming soon!');
      }
    });
  }

  // Messages button
  const messagesBtn = document.getElementById('topbar-messages-btn');
  if (messagesBtn) {
    messagesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/admin/messages';
    });
  }
})();


