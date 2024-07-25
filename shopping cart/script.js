const url = "https://content.newtonschool.co/v1/pr/65f821a4f6a42e24cda7e50c/productsData";
let productsContainer = document.querySelector(".productscontainer");

fetch(url)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((values) => {
            const container = document.createElement("div");
            container.className = "product";
            productsContainer.appendChild(container);

            container.innerHTML = `
        <img width="250px" height="350px" src=${values.image} alt="title" />
        <p class='ptitle'>${values.title}</p>
        <div class="priceandaddtocart">
        <p class="pprice">${values.price} DH</p>
        <button class="addtocart" data-productid=${values.id}></button>
        </div>
    `;
        });
        addToCart();
    });

let header = document.querySelector("header");
header.style.position = "sticky";
header.style.top = "0";

let cartui = document.querySelector(".cartui");
let carticon = document.querySelector(".carticon");
let closecart = document.querySelector(".closecart");

carticon.addEventListener("click", () => {
    cartui.classList.add("cartopened");
});

closecart.addEventListener("click", () => {
    cartui.classList.remove("cartopened");
});

async function addToCart() {
    const addToCartButtons = document.querySelectorAll(".addtocart");
    let pccontainer = document.querySelector(".pccontainer");
    let carticon = document.querySelector(".carticon");
    let count = 0;
    let cart = [];

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.getAttribute("data-productid");

            try {
                const response = await fetch(url);
                const productsData = await response.json();

                const productDetails = productsData.find((p) => p.id == productId);

                const existingProduct = cart.find((item) => item.id === productId);

                if (!existingProduct) {
                    cart.push({ ...productDetails, quantity: 1 });
                    count += 1;
                    carticon.setAttribute("items", count);
                    pccontainer.innerHTML += `
            <div class="cartproduct">
              <div class="pnp">
                <img class="img" src="${productDetails.image}">
                <div class="nameandprice">
                  <p>${productDetails.title}</p>
                  <p>${productDetails.price}</p>
                  <div class="plusminus">
                    <p>Qty:</p>
                    <button class="addqtt" data-productid="${productDetails.id}">+</button>
                    <p class="qtt">1</p>
                    <button class="minusqtt" data-productid="${productDetails.id}">-</button>
                  </div>
                </div>
              </div>
              <button class="delete" data-productid="${productDetails.id}">X</button>
            </div>
          `;
                }

                const deleteButtons = document.querySelectorAll(".delete");
                deleteButtons.forEach((button) => {
                    button.addEventListener("click", () => {
                        const productId = button.getAttribute("data-productid");
                        const productIndex = cart.findIndex((item) => item.id == productId);
                        if (productIndex !== -1) {
                            button.parentElement.remove();
                            cart.splice(productIndex, 1);
                            count -= 1;
                            carticon.setAttribute("items", count);
                        }
                    });
                });

                document.querySelector(".pccontainer").addEventListener("click", function (event) {
                    if (event.target.matches(".addqtt")) {
                        const productId = event.target.getAttribute("data-productid");
                        const product = cart.find((item) => item.id == productId);
                        if (product) {
                            product.quantity += 1;
                            const qtyD = event.target.parentElement.querySelector(".qtt");
                            qtyD.innerText = product.quantity;
                            count += 1;
                            carticon.setAttribute("items", count);
                        }
                    } else if (event.target.matches(".minusqtt")) {
                        const productId = event.target.getAttribute("data-productid");
                        const product = cart.find((item) => item.id == productId);
                        if (product && product.quantity > 1) {
                            product.quantity -= 1;
                            const qtyD = event.target.parentElement.querySelector(".qtt");
                            qtyD.innerText = product.quantity;
                            count -= 1;
                            carticon.setAttribute("items", count);
                        }
                    }
                });
            } catch (error) {
                console.log("Error fetching product details:", error);
            }
        });
    });
}