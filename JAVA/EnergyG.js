document.addEventListener("DOMContentLoaded", function () {
    const cartList = document.getElementById("cartList");
    const clearCartButton = document.getElementById("clearCart");
    const cartCountElement = document.getElementById("cartCount");
    const cartTotalElement = document.getElementById("cartTotal");
    const cartEmptyMessage = document.querySelector(".cart-empty");

    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartUI() {
        let cart = getCart();
        cartList.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartEmptyMessage.style.display = "block";
        } else {
            cartEmptyMessage.style.display = "none";
            cart.forEach((item, index) => {
                let listItem = document.createElement("li");
                listItem.innerHTML = `
                    ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartList.appendChild(listItem);
                total += item.price * item.quantity;
            });
        }
        cartTotalElement.textContent = total.toFixed(2);
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function addToCart(product) {
        let cart = getCart();
        let existingProduct = cart.find(item => item.name === product.name);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        updateCartUI();
        alert("Item added to cart!");
    }

    function removeFromCart(index) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        updateCartUI();
    }

    function clearCart() {
        localStorage.removeItem("cart");
        updateCartUI();
    }

    document.querySelectorAll(".addToCartBtn").forEach(button => {
        button.addEventListener("click", function () {
            addToCart({ name: this.dataset.name, price: parseFloat(this.dataset.price) });
        });
    });

    if (clearCartButton) {
        clearCartButton.addEventListener("click", clearCart);
    }

    if (cartList) {
        cartList.addEventListener("click", function (event) {
            if (event.target.classList.contains("remove-item")) {
                removeFromCart(parseInt(event.target.getAttribute("data-index")));
            }
        });
    }

    updateCartUI();
});
