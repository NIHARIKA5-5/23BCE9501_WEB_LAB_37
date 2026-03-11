let cart = [
  { name: "Laptop", category: "Electronics", price: 50000, quantity: 1 },
  { name: "Headphones", category: "Electronics", price: 2000, quantity: 2 },
  { name: "Books", category: "Education", price: 500, quantity: 3 }
];

let couponDiscount = 0;

function renderCart() {
  let tbody = document.getElementById("cartBody");
  tbody.innerHTML = "";

  cart.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.price}</td>
        <td>
          <input type="number" min="1" value="${item.quantity}"
          onchange="updateQuantity(${index}, this.value)">
        </td>
        <td>
          <button onclick="removeItem(${index})">X</button>
        </td>
      </tr>
    `;
  });

  calculateTotal();
}

function updateQuantity(index, qty) {
  cart[index].quantity = parseInt(qty);
  calculateTotal();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function applyCoupon() {
  let code = document.getElementById("coupon").value.trim().toUpperCase();

  if (code === "SAVE10") {
    couponDiscount = 0.10;
  } else if (code === "FESTIVE20") {
    couponDiscount = 0.20;
  } else {
    couponDiscount = 0;
  }

  calculateTotal();
}

function calculateTotal() {
  let subtotal = 0;
  let discount = 0;

  cart.forEach(item => {
    let itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    // Bulk Discount (10%)
    if (item.quantity >= 5) {
      discount += itemTotal * 0.10;
    }

    // Category Discount (15%)
    if (item.category === "Electronics") {
      discount += itemTotal * 0.15;
    }
  });

  let finalAmount = subtotal - discount;

  // Time Discount (5% after 6 PM)
  let hour = new Date().getHours();
  if (hour >= 18) {
    let timeDiscount = finalAmount * 0.05;
    discount += timeDiscount;
    finalAmount -= timeDiscount;
  }

  // Coupon Discount
  let couponValue = finalAmount * couponDiscount;
  discount += couponValue;
  finalAmount -= couponValue;

  // Display values
  document.getElementById("discountAmount").innerText =
    "Total Discount: ₹" + discount.toFixed(2);

  document.getElementById("totalPrice").innerText =
    "Final Payable Amount: ₹" + finalAmount.toFixed(2);
}

// Initial load
renderCart();
