// Cập nhật số lượng sản phẩm giỏ hàng khi nhấn vào ô số lượng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id");
      const quantity = +input.value;

      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}

// Cập nhật số lượng sản phẩm giỏ hàng khi nhấn vào ô số lượng
