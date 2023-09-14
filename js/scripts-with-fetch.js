document.addEventListener("DOMContentLoaded", () => {
  const productsGallery = document.getElementById("products-gallery");
  const searchInput = document.getElementById("searchInput");
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");
  const cartBadge = document.getElementById("cart-badge"); // Get the cart badge element
  const cartOffcanvas = new bootstrap.Offcanvas(
    document.getElementById("cart-offcanvas")
  ); // Initialize the offcanvas

  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Delay function for searching products
  let searchTimeout;

  // Function to update the cart badge
  function updateCartBadge() {
    if (cart.length > 0) {
      cartBadge.textContent = cart.length;
      cartBadge.style.display = "block"; // Show the badge
    } else {
      cartBadge.style.display = "none"; // Hide the badge if the cart is empty
    }
  }

  // Function to remove all products with the same ID from the cart and session storage
  // Function to remove all products with the same ID from the cart and session storage
  function removeAllProductsById(productId) {
    console.log("Removing product with ID:", productId);

    // Remove products with the specified ID from the cart
    cart = cart.splice((item) => item.id !== productId);

    // Log the cart content for debugging
    console.log("Updated cart:", cart);

    // Convert the cart array back to a JSON string and update it in session storage
    sessionStorage.setItem("cart", JSON.stringify(cart));

    // Log the updated cart from session storage for debugging
    console.log(
      "Cart in session storage:",
      JSON.parse(sessionStorage.getItem("cart"))
    );

    // Update the cart display
    updateCartDisplay();
    updateCartBadge();
  }

  // Function to update the cart display
  function updateCartDisplay() {
    cartList.innerHTML = "";
    const productMap = new Map(); // Map to store product quantities
    let totalPrice = 0;

    cart.forEach((product) => {
      if (productMap.has(product.id)) {
        // Increment the quantity if the product is already in the cart
        const quantity = productMap.get(product.id);
        productMap.set(product.id, quantity + 1);
      } else {
        // Add the product to the map with quantity 1 if it's not in the map
        productMap.set(product.id, 1);
      }
    });

    // Loop through the productMap and add items to the cart list
    productMap.forEach((quantity, productId) => {
      const product = cart.find((item) => item.id === productId); // Find the product in the cart
      if (product) {
        const cartItem = document.createElement("li");
        cartItem.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );
        cartItem.innerHTML = `
                <div>
                    ${product.title} 
                    <span>${quantity}</span>
                    $${(quantity * product.price).toFixed(2)}
                </div>
                <div>
                    <button class="btn btn-sm btn-danger delete-product" type="button"  data-product-id='${
                      product.id
                    }'>-</button>
                </div>
            `;
        cartList.appendChild(cartItem);

        // Inside the updateCartDisplay function, attach the remove function to the "Delete" buttons by their IDs
        const deleteButton = cartItem.querySelector(".delete-product");
        deleteButton.addEventListener("click", () => {
          const productId = deleteButton.getAttribute("data-product-id");
          console.log(productId);
          removeAllProductsById(productId);
        });

        // Calculate the total price
        totalPrice += quantity * product.price;
      }
    });

    // Update the total price element
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }

  // Function to fetch and display products
  function fetchAndDisplayProducts() {
    // Clear previous search timeout
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      fetch("./db/products.json") // Replace with the correct URL
        .then((response) => response.json())
        .then((products) => {
          // Filter products based on search input
          const searchTerm = searchInput.value.toLowerCase();
          const filteredProducts = products.filter((product) =>
            product.title.toLowerCase().includes(searchTerm)
          );

          // Clear the products gallery
          productsGallery.innerHTML = "";

          // Display filtered products
          filteredProducts.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("card");
            productDiv.innerHTML = `
                        <img
                            src="${product.image}"
                            alt="${product.title}"
                            class="card-img-top object-fit-contain"
                            style="width: 100%; height: 300px;"
                        />

                        <div class="card-body d-flex flex-column justify-content-between shadow-sm">
                            <div class="mb-4">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="lead">$ ${product.price}</p>
                                <p class="card-text">${product.description}</p>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary add-to-cart" type="button" data-product='${JSON.stringify(
                                  product
                                )}'>
                                    Agregar al carrito
                                    <i class="fa-solid fa-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    `;
            productsGallery.appendChild(productDiv);
          });

          // Add event listeners to "Add to Cart" buttons
          const addToCartButtons = document.querySelectorAll(".add-to-cart");
          addToCartButtons.forEach((button) => {
            button.addEventListener("click", () => {
              const productData = JSON.parse(
                button.getAttribute("data-product")
              );
              cart.push(productData);
              sessionStorage.setItem("cart", JSON.stringify(cart));
              updateCartDisplay();
              updateCartBadge();
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }, 300);
  }

  // Add event listener for search input
  searchInput.addEventListener("input", fetchAndDisplayProducts);

  // Show the cart offcanvas when the cart icon is clicked
  document.getElementById("cart-icon").addEventListener("click", () => {
    updateCartDisplay(); // Update the cart display before showing the offcanvas
    cartOffcanvas.show();
  });

  // Initial product display
  fetchAndDisplayProducts();

  // Display initial cart content
  updateCartDisplay();
  updateCartBadge();
});
