const cartItems = document.querySelector('#cart__items');
const totalQuantity = document.querySelector('#totalQuantity');
const totalPrice = document.querySelector('#totalPrice');
const form = document.querySelector('.cart__order__form');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');
const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const addressErrorMsg = document.querySelector('#addressErrorMsg');
const cityErrorMsg = document.querySelector('#cityErrorMsg');
const emailErrorMsg = document.querySelector('#emailErrorMsg');

let cartProduct = JSON.parse(localStorage.getItem('product')) || [];
let cartProductData = [];
let totalQtt = 0;
let totalPrices = 0;
let validInputs = 0;
let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: ""
};
let products = [];

// Retrieve products data from API
const fetchCartProductData = async () => {
  await fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(promise => {
      cartProductData = promise;
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération du produit !");
      console.error(error)
    })
}

// Display the cart
const cartDisplay = async () => {
  await fetchCartProductData();

  cartProduct.forEach(el => {

    const targetApiProduct = cartProductData.find(data => data._id === el.id);

    cartItems.innerHTML += `
      <article class="cart__item" data-id="${el.id}" data-color="${el.color}">
        <div class="cart__item__img">
          <img src="${targetApiProduct.imageUrl}" alt="${targetApiProduct.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${targetApiProduct.name}</h2>
            <p>${el.color}</p>
            <p>${targetApiProduct.price * el.quantity} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : ${el.quantity}</p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${el.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>
    `
  })

  modifyArticlesCartData()
  deleteItem()
  totalArticles()
  totalAmount()

}
cartDisplay();

// Modify articles data (quantity and price)
const modifyArticlesCartData = () => {
  const itemsQuantity = document.querySelectorAll('.itemQuantity');
  const articles = document.querySelectorAll('article');
  const frontSideQuantity = document.querySelectorAll('.cart__item__content__settings__quantity > p');
  const frontSidePrice = document.querySelectorAll('.cart__item__content__description :nth-child(3)');

  for (let i = 0; i < articles.length; i++) {
    for (let j = 0; j < cartProduct.length; j++) {
      if (articles[i].dataset.id === cartProduct[j].id && articles[i].dataset.color === cartProduct[j].color) {

        itemsQuantity[i].addEventListener('change', (e) => {
          const targetPrice = cartProductData.find(data => data._id === articles[i].dataset.id);

          // Update localStorage quantity
          cartProduct[j].quantity = +e.target.value;
          localStorage.setItem('product', JSON.stringify(cartProduct));

          // Update itemsQuantity value attribute
          itemsQuantity[i].setAttribute('value', cartProduct[j].quantity);

          // Update front side quantity
          frontSideQuantity[i].innerHTML = `Qté : ${itemsQuantity[i].value}`;

          // Update front side price
          frontSidePrice[i].innerHTML = `${targetPrice.price * itemsQuantity[i].value} €`;

          // Update total articles
          totalArticles()

          // Update total amount
          totalAmount()

        })

      }
    }
  }
}

// Delete an article
const deleteItem = () => {
  const deleteItemBtn = document.querySelectorAll('.deleteItem');
  const articles = document.querySelectorAll('article');

  for (let i = 0; i < articles.length; i++) {

    deleteItemBtn[i].addEventListener('click', () => {
      // Remove from DOM
      articles[i].remove();

      // Remove from localStorage
      cartProduct.splice(i, 1);
      localStorage.setItem('product', JSON.stringify(cartProduct));

      location.reload();
    })

  }
}

// Get total articles
const totalArticles = () => {
  let cartProductQuantities = [];

  for (let i = 0; i < cartProduct.length; i++) {
    cartProductQuantities.push(cartProduct[i].quantity)
  }

  totalQtt = cartProductQuantities.reduce((a, b) => a + b)

  totalQuantity.innerHTML = `${totalQtt}`
}

// Get total amount
const totalAmount = () => {
  const allPrices = document.querySelectorAll('.cart__item__content__description :nth-child(3)');
  let cartProductPrices = [];

  allPrices.forEach(price => cartProductPrices.push(+price.textContent.slice(0, -2)));

  totalPrices = cartProductPrices.reduce((a, b) => a + b)

  totalPrice.innerHTML = `${totalPrices}`
}

// Check inputs validation

const checkFirstName = () => {
  let nameRegex = /^[a-z\s]+$/gi;

  firstName.addEventListener('change', e => {
    firstName.value = e.target.value.trim();

    if (nameRegex.test(firstName.value)) {
      validInputs++;
      contact.firstName = firstName.value;
      firstNameErrorMsg.innerText = '';
    } else if (!nameRegex.test(firstName.value) || firstName.value === '') {
      validInputs--;
      contact.firstName = '';
      firstNameErrorMsg.innerText = 'Ce champ est requis et ne doit contenir que des lettres.'
    }

    console.log(validInputs, contact);

  })
}
checkFirstName()

const checkLastName = () => {
  let nameRegex = /^[a-z\s]+$/gi;
  validInputs

  lastName.addEventListener('change', e => {
    lastName.value = e.target.value.trim();

    if (nameRegex.test(lastName.value)) {
      validInputs++;
      contact.lastName = lastName.value;
      lastNameErrorMsg.innerText = '';
    } else if (!nameRegex.test(lastName.value) || lastName.value === '') {
      validInputs--;
      contact.lastName = '';
      lastNameErrorMsg.innerText = 'Ce champ est requis et ne doit contenir que des lettres.'
    }

    console.log(validInputs, contact);

  })
}
checkLastName()

const checkAddress = () => {
  let addressRegex = /^[a-z0-9\s]+$/gi;

  address.addEventListener('change', e => {
    address.value = e.target.value.trim();

    if (addressRegex.test(address.value)) {
      validInputs++;
      contact.address = address.value;
      addressErrorMsg.innerText = '';
    } else if (!addressRegex.test(address.value) || address.value === '') {
      validInputs--;
      contact.address = '';
      addressErrorMsg.innerText = 'Ce champ est requis et ne doit contenir que des caractères alphanumériques.'
    }

    console.log(validInputs, contact);

  })
}
checkAddress()

const checkCity = () => {
  let addressRegex = /^[a-z0-9\s]+$/gi;

  city.addEventListener('change', e => {
    city.value = e.target.value.trim();

    if (addressRegex.test(city.value)) {
      validInputs++;
      contact.city = city.value;
      cityErrorMsg.innerText = '';
    } else if (!addressRegex.test(city.value) || city.value === '') {
      validInputs--;
      contact.city = '';
      cityErrorMsg.innerText = 'Ce champ est requis et ne doit contenir que des caractères alphanumériques.'
    }

    console.log(validInputs, contact);

  })
}
checkCity()

const checkEmail = () => {
  let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

  email.addEventListener('change', e => {
    email.value = e.target.value.trim();

    if (emailRegex.test(email.value)) {
      validInputs++;
      contact.email = email.value;
      emailErrorMsg.innerText = '';
    } else if (!emailRegex.test(email.value) || email.value === '') {
      validInputs--;
      contact.email = '';
      emailErrorMsg.innerText = "Ce champ est requis et doit être saisie d'une adresse mail valide."
    }

    console.log(validInputs, contact);

  })
}
checkEmail()

// Implemment product array with id
const productsArrayImplementation = () => {
  cartProduct.forEach(product => {
    products.push(product.id)
  })
}
productsArrayImplementation()


// Post order
const postOrder = () => {
  const order = { contact, products }

  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(data => {

      window.location = `confirmation.html?${data.orderId}`;
      // console.log('Réponse: ', data);
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de l'envoie de la commande !");
      console.error(error)
    })

}

// Send order
form.addEventListener('submit', (e) => {
  e.preventDefault()

  confirm('Voulez-vous valider votre commande ?') && validInputs === 5 ? postOrder() : ''

  console.log(validInputs);
  console.log(products);
  console.log(contact);

})