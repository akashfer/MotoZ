const WHATSAPP_PHONES = ["94764474693", "94751501176"];
const DELIVERY_CHARGE = 450;

function buildWhatsappMessage(cart, customer) {
  const totals = cartTotals(cart);
  const grandTotal = totals.totalPrice + DELIVERY_CHARGE;

  let message = "Hello, I want to place an order.\n\nOrder Details:\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `Color: ${item.color}\n`;
    message += `Qty: ${item.quantity}\n`;
    message += `Price: ${item.price.toLocaleString("en-LK")}\n\n`;
  });

  message += `Total Items: ${totals.totalItems}\n`;
  message += `Subtotal: ${totals.totalPrice.toLocaleString("en-LK")} LKR\n`;
  message += `Delivery Charge: ${DELIVERY_CHARGE.toLocaleString("en-LK")} LKR\n`;
  message += `Grand Total: ${grandTotal.toLocaleString("en-LK")} LKR\n\n`;
  message += `My Name: ${customer.name}\n`;
  message += `My Phone Number: ${customer.phone}\n`;
  message += `Nearest City: ${customer.city}\n`;
  message += `My Address: ${customer.address}\n`;

  return message;
}

function sendOrderToWhatsapp() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const customer = {
    name: (document.getElementById("customerName")?.value || "").trim(),
    phone: (document.getElementById("customerPhone")?.value || "").trim(),
    city: (document.getElementById("customerCity")?.value || "").trim(),
    address: (document.getElementById("customerAddress")?.value || "").trim()
  };

  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    alert("Please fill in name, phone number, nearest city, and address.");
    return;
  }

  const message = buildWhatsappMessage(cart, customer);
  const nextIndex = getNextWhatsappIndex();
  const phone = WHATSAPP_PHONES[nextIndex];
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function getNextWhatsappIndex() {
  const key = "whatsapp_order_index";
  const current = Number.parseInt(localStorage.getItem(key) || "0", 10);
  const safeCurrent = Number.isFinite(current) ? current : 0;
  const next = (safeCurrent + 1) % WHATSAPP_PHONES.length;
  localStorage.setItem(key, String(next));
  return safeCurrent % WHATSAPP_PHONES.length;
}

function setupWhatsappButton() {
  const button = document.getElementById("sendWhatsapp");
  if (!button) return;
  button.addEventListener("click", sendOrderToWhatsapp);
}

document.addEventListener("DOMContentLoaded", setupWhatsappButton);

