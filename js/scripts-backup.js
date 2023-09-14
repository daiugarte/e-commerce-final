// Mi array de productos
const products = [
  {
    id: 1,
    title: "Aperol",
    image: "./img/aperol.avif",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 19.99,
    quantity: 1,
  },
  {
    id: 2,
    title: "Budweiser",
    image: "./img/budweiser.avif",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 7.5,
    quantity: 1,
  },
  {
    id: 3,
    title: "Catena Zapata Malbec",
    image: "./img/catena-zapata-malbec.avif",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 29.99,
    quantity: 1,
  },
  {
    id: 4,
    title: "Johnnie Walker Black Label",
    image: "./img/johnnie-walker-black-label.avif",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 150.0,
    quantity: 1,
  },
  {
    id: 5,
    title: "Fernet Branca",
    image: "./img/fernet-branca.avif",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 100.0,
    quantity: 1,
  },
  {
    id: 6,
    title: "Johnnie Walker Blue Label",
    image: "./img/johnnie-walker-blue-label.avif",
    description: "El mejor whisky del mundo, un elissir.",
    price: 299.99,
    quantity: 1,
  },
  {
    id: 7,
    title: "Quilmes",
    image: "./img/quilmes.avif",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 5.5,
    quantity: 1,
  },
];

//Funcion para filtrar y mostrar los productos
function searchProducts() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const productList = document.getElementById("products-gallery");
  productList.innerHTML = ""; // Limpia la lista de productos existente

  // Filtrar productos en base a lo ingresado en el input
  const filteredProducts = products.filter((product) => {
    const productName = product.title.toLowerCase();
    return productName.includes(searchInput);
  });

  // Mostrar los productos filtrados
  filteredProducts.forEach((product, index) => {
    const productItem = document.createElement("div");
    productItem.classList.add("card");
    productItem.innerHTML = `

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
            <button class="btn btn-outline-primary" type="button" onclick="addToCart(${index})">
                Agregar al carrito
                <i class="fa-solid fa-cart-plus"></i>
            </button>
        </div>
    </div>
    `;
    productList.appendChild(productItem);
  });
}

// Agregar producto al carrito
function addToCart(productIndex) {
  // Obtener el carrito de sessionStorage o crear un array vacio
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Agregar el producto seleccionado al carrito
  cart.push(products[productIndex]);

  // Guardar el carrito actualizado en sessionStorage
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

  // Actualizar el badge con la cantidad de elementos en el carrito
  displayCartBadge();

  // Actualizar la vista de los elementos del carrito
  displayCart();
}

// // Funcion para renderizar los produtos del carrito en el sidebar offcanvas de Bootstrap
function displayCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = ""; // Limpia la lista de productos existente

  // Obtener el carrito de sessionStorage o crear un array vacio
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Renderizar los elementos del carrito dentro de el offcanvas
  cart.forEach((cartItem, index) => {
    const cartItemElement = document.createElement("li");
    cartItemElement.classList.add("list-group-item");
    cartItemElement.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <span>${cartItem.title} - $${cartItem.price.toFixed(2)}</span>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
    cartList.appendChild(cartItemElement);
  });
}

// // Funcion para eleminar un producto del carrito
function removeFromCart(cartIndex) {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Eliminar el producto seleccionado del carrito
  cart.splice(cartIndex, 1);

  // Actualizar el carrito en sessionStorage
  sessionStorage.setItem("cart", JSON.stringify(cart));

  // Actualizar el badge con la cantidad de elementos en el carrito
  displayCartBadge();

  // Actualizar la vista de los elementos del carrito
  displayCart();
}

// // Funcion para mostrar un badge de Boostratp con la canitad de elementos en el carrito
function displayCartBadge() {
  const cartBadge = document.getElementById("cart-badge");

  // Obtener el carrito de sessionStorage o crear un array vacio
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Calcular el total de elementos en el carrito
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  // Actualizar el numero en el badge con la cantidad total
  cartBadge.textContent = totalQuantity.toString();
}

// // Llamar la funcion searchProducts para mostrar todos los productos
searchProducts();

// // Iniciar la funcion del badge para mostrar la cantidad de elementos en el carrito
displayCartBadge();

// // Iniciar la funcion para mostrar los elementos del carrito en el offcanvas
displayCart();
