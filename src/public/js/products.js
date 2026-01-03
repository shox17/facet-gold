console.log("Products frontend javascript file");

$(function () {
  // Both size and weight fields are always visible now - no need to toggle
  $("#process-btn").on("click", () => {
    $(".product-form-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".product-form-container").slideToggle(100);
    $("#process-btn").css("display", "flex");
  });

  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id,
      productStatus = $(`#${id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });
      console.log("response:", response);
      const result = response?.data;
      if (result?.data) {
        $(".new-product-status").blur();
      } else alert("Product update failed!");
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
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
    productVolume = $(".product-volume").val(),
    productDesc = $(".product-desc").val();

  if (
    productName === "" ||
    productStatus === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productCollection === "" ||
    productSize === "" ||
    productVolume === ""
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
