// import { comprarProducto } from "./carrito.js";

document.addEventListener("DOMContentLoaded", () => {
  const productsGallery = document.getElementById("products-gallery");
  const searchInput = document.getElementById("search-input");
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");
  const cartBadge = document.getElementById("cart-badge");


  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Funcion de delay cuando se busca productos
  let searchTimeout;

  // Funcion para actualizar el badge contador de productos en el carrito
  function updateCartBadge() {
    if (cart.length > 0) {
      cartBadge.textContent = cart.reduce((total, {quantity}) => total + quantity, 0);
      cartBadge.style.display = "block"; // Mostrar badge
    } else {
      cartBadge.style.display = "none"; // Ocultar badge si el carrito esta vacio
    }
  }

  // Funcion para habilitar o no, el boton de pagar en base a si hay productos en el carrito

  const addToCart = (productId, fetchedProducts) => {
    const product = fetchedProducts.find((product) => product.id === productId);
    const { name, price, image, id } = product;
    const cartProduct = cart.find((product) => product.id === productId);
    if (cartProduct === undefined) {
      const addNewProduct = {
        id: id,
        name: name,
        price: price,
        image: image,
        quantity: 1,
      };
      cart.push(addNewProduct);
      sessionStorage.setItem("cart", JSON.stringify(cart));

       // Mostrar notificacion con la libreria toastify
      Toastify({
        text: "Producto agregado al carrito",
        duration: 1500,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: { background: "green" },
    }).showToast();

    } else {
      const indexProductCart = cart.findIndex(
        (producto) => producto.id === productId
      );
      cart[indexProductCart].quantity++;
      cart[indexProductCart].price = price * cart[indexProductCart].quantity;
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }
    cart = JSON.parse(sessionStorage.getItem("cart"));
    // console.log(`${name} fue agregado al carrito.`);

  };

  function updateCartDisplay() {
    cartList.innerHTML = "";
    let totalPrice = 0;

    // Mostrar productos en el carrito
    cart.forEach((product) => {
      const cartItem = document.createElement("li");
      cartItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      cartItem.innerHTML = `
              <div>
                  ${product.name}
                  $${(product.quantity * product.price).toFixed(2)}
              </div>
              <div>
              <button id="increase-${product.id}" class="btn btn-success btn-sm">+</button>
              <span>${product.quantity}</span>
              <button id="decrease-${product.id}" class="btn btn-danger btn-sm">-</button>
              </div>
          `;
      cartList.appendChild(cartItem);

      const increaseButton = document.getElementById(`increase-${product.id}`)
      const decreaseButton = document.getElementById(`decrease-${product.id}`)

      increaseButton.addEventListener("click", () => increaseQuantity(product.id))
      decreaseButton.addEventListener("click", () => decreaseQuantity(product.id)
      )

      // Calcular precio total
      totalPrice += product.quantity * product.price;
    });

    // Actualizar precio total
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }

const increaseQuantity = (id) => {
  const indexProductCart = cart.findIndex((product) => product.id === id)
  const price = cart[indexProductCart].price / cart[indexProductCart].quantity

  cart[indexProductCart].quantity++
  cart[indexProductCart].price = price*cart[indexProductCart].quantity

  sessionStorage.setItem("cart", JSON.stringify(cart))

  updateCartBadge()
  updateCartDisplay()
}

const decreaseQuantity = (id) => {
  const indexProductCart = cart.findIndex((product) => product.id === id)
  const price = cart[indexProductCart].price / cart[indexProductCart].quantity

  cart[indexProductCart].quantity--
  cart[indexProductCart].price = price*cart[indexProductCart].quantity

  if(cart[indexProductCart].quantity === 0){
      cart.splice(indexProductCart, 1)
  }

  sessionStorage.setItem("cart", JSON.stringify(cart))

  updateCartBadge()
  updateCartDisplay()
}

  // Funcion para obtener productos y mostrarlos en pantalla
  function fetchAndDisplayProductsproducts() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      fetch("./db/products.json")
        .then((response) => response.json())
        .then((products) => {
          // Filtrar productos en base a lo tipeado en el input
          const searchTerm = searchInput.value.toLowerCase();
          const filteredProducts = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm)
          );

          // Crear galeria de productos
          productsGallery.innerHTML = "";

          // Mostrar productos
          filteredProducts.forEach((product) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="card-img-top object-fit-contain"
                        style="width: 100%; height: 300px;"
                    />
                    <div class="card-body d-flex flex-column justify-content-between shadow-sm">
                        <div class="mb-4">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="lead">$ ${product.price}</p>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary add-to-cart" type="button" data-product='${product.id}'>
                                Agregar al carrito
                                <i class="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>`;

            productsGallery.appendChild(card);
          });
          // Agregar event listeners para los botones de "Agregar al carrito"
          const addToCartButtons = document.querySelectorAll(".add-to-cart");
          addToCartButtons.forEach((button) => {
            button.addEventListener("click", () => {
              const productData = JSON.parse(
                button.getAttribute("data-product")
              );

              addToCart(productData, products);
              updateCartBadge()
              updateCartDisplay()
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }, 300);
  }

  // Add event listener for search input
  searchInput.addEventListener("input", fetchAndDisplayProductsproducts);

  // Iniciar el fetch y mostrar los productos
  fetchAndDisplayProductsproducts();
  // Mostrar el estado inicial del carrito
  updateCartDisplay();
  updateCartBadge();
}); // Document Loaded
