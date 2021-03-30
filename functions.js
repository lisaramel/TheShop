const allProducts = [];

function getAllProducts() {
  fetch("fakestore.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach(function (products) {
        if (
          products.category == "women clothing" ||
          products.category == "men clothing"
        ) {
          const product = {
            id: products.id,
            title: products.title,
            description: products.description,
            image: products.image,
            price: products.price,
            quantityPrice: products.price,
            category: products.category,
            amount: 1,
          };
          allProducts.push(product);
        }
      });
      sessionStorage.setItem("products", JSON.stringify(allProducts));
    })
    .catch((error) => console.error(error));
}

function productCard() {
  const productItem = JSON.parse(sessionStorage.getItem("products"));
  let output = "";

  productItem.forEach(function (product) {
    let index = productItem.indexOf(product);
    output += `<span id="productCard">
    <div class="infoContainer">
      <img src="${product.image}" alt="" />
      <div class="overlay">
        <div class="text">${product.description}</div>
      </div>
    </div>
    <span id="productText" style="text-align: center;">
    <h3 id="productTitle" class="productTitle">${product.title}</h3>
    <p style="font-weight: 500">$${product.price}</p>
    <button id="${index}" class="buyButton">buy</button>
  </span>
  </span>`;
    document.querySelector(".productCards").innerHTML = output;
  });
}

function getButtons() {
  const button = document.querySelectorAll(".buyButton");

  var allButtons = Array.from(button);

  allButtons.forEach(function (button) {
    const id = `${button.id}`;

    button.addEventListener("click", function () {
      const productItem = JSON.parse(sessionStorage.getItem("products"));
      let getProduct = productItem[id];
      const found = JSON.parse(localStorage.getItem(getProduct.id));
      if (!found) {
        localStorage.setItem(getProduct.id, JSON.stringify(getProduct));
      } else {
        const amount = JSON.parse(localStorage.getItem(getProduct.id)).amount;
        getProduct.amount = amount + 1;
        localStorage.setItem(getProduct.id, JSON.stringify(getProduct));
      }
    });
  });
}

function addToCart() {
  let output = `<table id="cartItem">`;

  Object.keys(localStorage).forEach((key) => {
    const image = JSON.parse(localStorage.getItem(key)).image;
    const title = JSON.parse(localStorage.getItem(key)).title;
    const quantity = JSON.parse(localStorage.getItem(key)).amount;
    const quantityPrice = JSON.parse(localStorage.getItem(key)).quantityPrice;

    output += `<tr>
        <td><img id="itemImage" src="${image}" alt="" /></td>
        <td><h3 id="itemTitle" class="productTitle">${title}</h3></td>
        <td><p class="itemPrice" style="font-weight: 500">$${quantityPrice}</p></td>
        <td><div style="font-family: Lato, sans-serif;">
        <button id="${key}" class="minusButton" style="font-size: 14;">-</button>
        ${quantity}
        <button id="${key}" class="plusButton">+</button></div>
    </div></td>
        </tr>
        `;
    document.querySelector(".cart").innerHTML = output;
  });
}

function quantityPrice(product, id) {
  let price = JSON.parse(localStorage.getItem(product)).price;
  let quantity = JSON.parse(localStorage.getItem(product)).amount;
  let itemPrice = Number(price * quantity).toFixed(2);

  const getPrice = JSON.parse(localStorage.getItem(id));
  getPrice.quantityPrice = itemPrice;
  localStorage.setItem(getPrice.id, JSON.stringify(getPrice));
}

function getQuantityButtons() {
  const plusButton = document.querySelectorAll(".plusButton");
  const minusButton = document.querySelectorAll(".minusButton");

  Array.from(plusButton, (button) =>
    button.addEventListener("click", function () {
      const id = `${button.id}`;

      const getProduct = JSON.parse(localStorage.getItem(id));
      const amount = JSON.parse(localStorage.getItem(getProduct.id)).amount;
      getProduct.amount = amount + 1;
      localStorage.setItem(getProduct.id, JSON.stringify(getProduct));
      quantityPrice(getProduct.id, id);
    })
  );

  Array.from(minusButton, (button) =>
    button.addEventListener("click", function () {
      const id = `${button.id}`;

      const getProduct = JSON.parse(localStorage.getItem(id));
      const amount = JSON.parse(localStorage.getItem(getProduct.id)).amount;
      if (amount > 1) {
        getProduct.amount = amount - 1;
        localStorage.setItem(getProduct.id, JSON.stringify(getProduct));
        quantityPrice(getProduct.id, id);
      } else {
        localStorage.removeItem(id);
      }
    })
  );
}

function totalPrice() {
  let sum = 0;
  Object.keys(localStorage).forEach((key) => {
    const quantityPrice = JSON.parse(localStorage.getItem(key)).quantityPrice;
    sum += Number(quantityPrice);
  });

  let totalPrice = Number(sum).toFixed(2);
  console.log(totalPrice);
  document.querySelector(".totalPrice").innerHTML =
    "Total price: <br> $" + totalPrice;
}

function checkout() {
  const checkoutBtn = document.querySelector(".checkout");
  const span = document.querySelector(".close");

  checkoutBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  span.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

function order() {
  $("#orderBtn").on("click", function () {
    if ($("#contactForm").valid()) {
      $("#contactForm").css({ display: "none" });
      $(".formHeader").html("Thank you for <br> your order!");
      localStorage.clear();
    }
  });
}

function validateInput() {
  $(document).ready(function () {
    $("#contactForm").validate({
      errorClass: "errorAlert",
      validClass: "validAlert",
      rules: {
        fname: {
          required: true,
          minlength: 3,
        },
        lname: {
          required: true,
          minlength: 3,
        },
        email: {
          required: true,
          email: true,
        },
        phone: {
          required: true,
          number: true,
          min: 10,
        },
        address: {
          required: true,
          minlength: 3,
        },
        zipcode: {
          required: true,
          minlength: 3,
          number: true,
        },
        state: {
          required: true,
          minlength: 3,
        },
        city: {
          required: true,
          minlength: 3,
        },
      },
    });
  });
}
