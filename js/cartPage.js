function formatPrice(value) {
  return `${value.toLocaleString("en-LK")} LKR`;
}

function renderCartPage() {
  const cart = getCart();
  const body = document.getElementById("cartBody");
  const summary = document.getElementById("cartSummary");
  const empty = document.getElementById("emptyState");

  if (!body || !summary || !empty) return;

  if (cart.length === 0) {
    body.innerHTML = "";
    summary.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  body.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.quantity;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.color}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" data-product="${item.productId}" data-color="${item.color}">
      </td>
      <td>${formatPrice(item.price)}</td>
      <td>${formatPrice(itemTotal)}</td>
      <td>
        <button class="btn secondary" data-remove="${item.productId}" data-color="${item.color}">Remove</button>
      </td>
    `;

    body.appendChild(row);
  });

  const totals = cartTotals(cart);
  const deliveryCharge = 450;
  summary.innerHTML = `
    <div><strong>Total Items:</strong> ${totals.totalItems}</div>
    <div><strong>Subtotal:</strong> ${formatPrice(totals.totalPrice)}</div>
    <div><strong>Delivery Charge:</strong> ${formatPrice(deliveryCharge)}</div>
    <div><strong>Grand Total:</strong> ${formatPrice(totals.totalPrice + deliveryCharge)}</div>
  `;

  body.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("change", () => {
      const productId = Number(input.dataset.product);
      const color = input.dataset.color;
      updateCartQuantity(productId, color, Number(input.value));
      renderCartPage();
    });
  });

  body.querySelectorAll("button[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const productId = Number(btn.dataset.remove);
      const color = btn.dataset.color;
      removeFromCart(productId, color);
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCartPage);
