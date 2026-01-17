console.log("Products frontend javascript file");

$(function () {
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

  // Search and Filter Functionality
  const searchInput = document.getElementById('product-search-input');
  const filterSelect = document.getElementById('product-filter-select');
  const tableRows = document.querySelectorAll('.products-table tbody tr');

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterValue = filterSelect.value;

    tableRows.forEach(row => {
      const productName = row.getAttribute('data-product-name') || '';
      const productCollection = row.getAttribute('data-product-collection') || '';

      // Check search filter
      const matchesSearch = searchTerm === '' || productName.includes(searchTerm);

      // Check collection filter
      const matchesFilter = filterValue === 'all' || productCollection === filterValue;

      // Show/hide row based on both filters
      if (matchesSearch && matchesFilter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Add event listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', filterProducts);
  }

  // Modal system handles open/close - no need for manual toggle
  // Both size and weight fields are always visible now - no need to toggle

  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id,
      productStatus = $(`#${id}.new-product-status`).val();

    // Update badge immediately for better UX
    if (typeof updateProductStatusBadge === 'function') {
      updateProductStatusBadge(id, productStatus);
    }

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });
      console.log("response:", response);
      const result = response?.data;
      if (result?.data) {
        $(".new-product-status").blur();
      } else {
        alert("Product update failed!");
        // Revert badge on error
        if (typeof updateProductStatusBadge === 'function') {
          const originalStatus = $(this).data('original-status') || 'PAUSE';
          updateProductStatusBadge(id, originalStatus);
        }
      }
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
      // Revert badge on error
      if (typeof updateProductStatusBadge === 'function') {
        const originalStatus = $(this).data('original-status') || 'PAUSE';
        updateProductStatusBadge(id, originalStatus);
      }
    }
  });
});

function validateForm() {
  const productName = $(".product-name").val(),
    productStatus = $(".product-status").val(),
    productPrice = $(".product-price").val(),
    productLeftCount = $(".product-left-count").val(),
    productCollection = $(".product-collection").val(),
    productSize = $(".product-size").val(),
    productWeightGram = $(".product-weight-gram").val(),
    productDesc = $(".product-desc").val();

  if (
    productName === "" ||
    productStatus === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productCollection === "" ||
    productSize === "" ||
    productWeightGram === ""
  ) {
    alert("Please insert all required details!");
    return false;
  }
  
  // Validate numeric inputs
  if (isNaN(parseFloat(productPrice)) || parseFloat(productPrice) <= 0) {
    alert("Please enter a valid product price!");
    return false;
  }
  
  if (isNaN(parseInt(productLeftCount)) || parseInt(productLeftCount) < 0) {
    alert("Please enter a valid product count!");
    return false;
  }
  
  return true;
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  console.log("input:", input);

  const file = $(`.${imgClassName}`).get(0)?.files[0],
    fileType = file["type"],
    validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageTypes.includes(fileType)) {
    alert("Please insert only jpeg, jpg, and png");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
