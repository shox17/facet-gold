console.log("Users frontend javascript file");

// Search and Filter Functionality - Global function
function filterCustomers() {
  const searchInput = document.getElementById('customer-search-input');
  const filterSelect = document.getElementById('customer-filter-select');
  
  if (!searchInput || !filterSelect) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filterValue = filterSelect.value.toUpperCase();

  // Get fresh list of rows each time (in case DOM changed)
  const rows = document.querySelectorAll('.customers-table tbody tr');
  
  rows.forEach(row => {
    const customerName = row.getAttribute('data-customer-name') || '';
    const customerPhone = row.getAttribute('data-customer-phone') || '';
    
    // Get current status from the select dropdown in the row, or fallback to data attribute
    const statusSelect = row.querySelector('.member-status');
    let customerStatus = '';
    
    // If status select exists, use its value (more accurate for real-time updates)
    if (statusSelect) {
      customerStatus = statusSelect.value.toUpperCase();
    } else {
      customerStatus = (row.getAttribute('data-customer-status') || '').toUpperCase();
    }

    // Check search filter (name or phone)
    const matchesSearch = searchTerm === '' || 
      customerName.includes(searchTerm) || 
      customerPhone.includes(searchTerm);

    // Check status filter
    const matchesFilter = filterValue === 'ALL' || customerStatus === filterValue;

    // Show/hide row based on both filters
    if (matchesSearch && matchesFilter) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

$(function(){
  // Add pop-up messages for non-functional buttons
  $('.btn-icon-secondary[title="Export"]').on('click', function(e) {
    e.preventDefault();
    if (typeof showToast === 'function') {
      showToast('Export feature is coming soon!', 'info', 3000);
    } else {
      alert('Export feature is coming soon!');
    }
  });

  $('.btn-icon-secondary[title="Refresh"]').on('click', function(e) {
    e.preventDefault();
    if (typeof showToast === 'function') {
      showToast('Refresh feature is coming soon!', 'info', 3000);
    } else {
      alert('Refresh feature is coming soon!');
    }
  });

  // Add event listeners
  const searchInput = document.getElementById('customer-search-input');
  const filterSelect = document.getElementById('customer-filter-select');

  if (searchInput) {
    searchInput.addEventListener('input', filterCustomers);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', filterCustomers);
  }

   $(".member-status").on("change", function (e){
    const id = e.target.id,
      memberStatus = $(`#${id}.member-status`).val();

    // Update the data attribute on the row when status changes
    const row = $(this).closest('tr');
    if (row.length) {
      row.attr('data-customer-status', memberStatus);
    }

    axios
    .post("/admin/user/edit", {
      _id: id,
      memberStatus: memberStatus,
    })
    .then((response) => {
      console.log("response:", response);
      const result = response?.data;
  
      if (result?.data) {
        $(".member-status").blur();
        // Re-apply filters after status change
        if (typeof filterCustomers === 'function') {
          filterCustomers();
        }
      } else {
        alert("User update failed!");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("User update failed!");
    });  
   });
 });
