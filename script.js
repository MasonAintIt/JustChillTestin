// Inventory Manager Plus JavaScript

// Theme Toggle Functionality
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('imp-theme', newTheme);
  
  // Add smooth transition effect
  body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    body.style.transition = '';
  }, 300);
}

// Initialize theme on page load
function initializeTheme() {
  const savedTheme = localStorage.getItem('imp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.body.setAttribute('data-theme', defaultTheme);
}

// Tab Switching Functionality
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Remove active class from all tabs
  const tabLinks = document.querySelectorAll('.imp-admin-tabs li');
  tabLinks.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  const selectedTab = document.getElementById(tabName + '-tab');
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
  
  // Add active class to clicked tab
  const clickedTab = document.querySelector(`[href="#${tabName}"]`).parentElement;
  clickedTab.classList.add('active');
  
  // Update URL hash without scrolling
  if (history.pushState) {
    history.pushState(null, null, `#${tabName}`);
  } else {
    location.hash = `#${tabName}`;
  }
}

// Handle browser back/forward navigation
function handleHashChange() {
  const hash = window.location.hash.substring(1);
  if (hash && ['dashboard', 'products', 'reports', 'settings'].includes(hash)) {
    showTab(hash);
  }
}

// Form Handling
function handleFormSubmission() {
  const forms = document.querySelectorAll('.imp-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success notice
      showNotice('Form submitted successfully!', 'success');
      
      // Reset form if it's not the settings form
      if (!this.closest('#settings-tab')) {
        this.reset();
      }
    });
  });
}

// Notice System
function showNotice(message, type = 'info') {
  // Create notice element
  const notice = document.createElement('div');
  notice.className = `imp-notice imp-notice-${type}`;
  notice.innerHTML = `
    <span class="dashicons dashicons-admin-generic"></span>
    <p>${message}</p>
  `;
  
  // Insert at the top of the active tab
  const activeTab = document.querySelector('.tab-content[style*="block"]') || 
                   document.getElementById('dashboard-tab');
  activeTab.insertBefore(notice, activeTab.firstChild);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notice.parentNode) {
      notice.style.opacity = '0';
      notice.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        notice.remove();
      }, 300);
    }
  }, 5000);
}

// Table Actions
function setupTableActions() {
  // Add click handlers to action buttons
  document.addEventListener('click', function(e) {
    if (e.target.matches('.button') && e.target.textContent.trim() === 'Edit') {
      e.preventDefault();
      showNotice('Edit functionality would be implemented here.', 'info');
    }
    
    if (e.target.matches('.button') && e.target.textContent.trim() === 'Delete') {
      e.preventDefault();
      if (confirm('Are you sure you want to delete this item?')) {
        const row = e.target.closest('tr');
        if (row) {
          row.style.opacity = '0';
          row.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            row.remove();
            showNotice('Item deleted successfully.', 'success');
          }, 300);
        }
      }
    }
  });
}

// Chart Placeholder
function initializeCharts() {
  const chartContainer = document.getElementById('salesChart');
  if (chartContainer) {
    const ctx = chartContainer.getContext('2d');
    
    // Simple placeholder chart
    ctx.fillStyle = 'var(--imp-primary)';
    ctx.fillRect(0, 0, chartContainer.width, chartContainer.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sales Chart Placeholder', chartContainer.width / 2, chartContainer.height / 2);
  }
}

// Responsive Menu Toggle for Mobile
function setupMobileMenu() {
  const tabs = document.querySelector('.imp-admin-tabs');
  
  // Add mobile menu toggle if needed
  if (window.innerWidth <= 767) {
    tabs.style.flexWrap = 'wrap';
  }
}

// Keyboard Navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + number keys for tab switching
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      const tabNames = ['dashboard', 'products', 'reports', 'settings'];
      const tabIndex = parseInt(e.key) - 1;
      if (tabNames[tabIndex]) {
        showTab(tabNames[tabIndex]);
      }
    }
    
    // Alt + T for theme toggle
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// Search Functionality (basic implementation)
function setupSearch() {
  const searchInputs = document.querySelectorAll('input[type="search"]');
  
  searchInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const table = e.target.closest('.imp-table-container')?.querySelector('table');
      
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      }
    });
  });
}

// Animation Observer for Cards
function setupAnimationObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe cards and metrics
  document.querySelectorAll('.imp-card, .imp-metric').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Local Storage for Form Data
function setupFormPersistence() {
  const forms = document.querySelectorAll('.imp-form');
  
  forms.forEach(form => {
    const formId = form.closest('[id]')?.id || 'default';
    
    // Load saved data
    const savedData = localStorage.getItem(`imp-form-${formId}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          if (input.type === 'checkbox') {
            input.checked = data[key];
          } else {
            input.value = data[key];
          }
        }
      });
    }
    
    // Save data on input
    form.addEventListener('input', function(e) {
      const formData = new FormData(form);
      const data = {};
      
      for (let [key, value] of formData.entries()) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && input.type === 'checkbox') {
          data[key] = input.checked;
        } else {
          data[key] = value;
        }
      }
      
      localStorage.setItem(`imp-form-${formId}`, JSON.stringify(data));
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize core functionality
  initializeTheme();
  handleFormSubmission();
  setupTableActions();
  setupKeyboardNavigation();
  setupSearch();
  setupFormPersistence();
  
  // Handle hash navigation
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // Handle initial hash
  
  // Initialize animations with delay to avoid flash
  setTimeout(() => {
    setupAnimationObserver();
  }, 100);
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupMobileMenu, 250);
  });
  
  // Initial mobile menu setup
  setupMobileMenu();
  
  // Show welcome message
  setTimeout(() => {
    showNotice('Welcome to Inventory Manager Plus! All systems are operational.', 'success');
  }, 500);
});

// System monitoring (placeholder)
function systemHealth() {
  return {
    status: 'healthy',
    uptime: '99.9%',
    lastSync: new Date().toISOString(),
    activeUsers: Math.floor(Math.random() * 100) + 50
  };
}

// Export functions for potential external use
window.IMP = {
  showTab,
  toggleTheme,
  showNotice,
  systemHealth
};
