const cartItems = document.querySelector('#cart__items');
const totalQuantity = document.querySelector('#totalQuantity');
const totalPrice = document.querySelector('#totalPrice');

let cartProduct = JSON.parse(localStorage.getItem('product')) || [];
let cartProductData = [];
let totalQtt = 0;
let totalPrices = 0;

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


const totalArticles = () => {
  let cartProductQuantities = [];
  
  for (let i = 0; i < cartProduct.length; i ++) {
    cartProductQuantities.push(cartProduct[i].quantity)
  }

  totalQtt = cartProductQuantities.reduce((a, b) => a + b)
  
  totalQuantity.innerHTML = `${totalQtt}`
}


const totalAmount = () => {
  const allPrices = document.querySelectorAll('.cart__item__content__description :nth-child(3)');
  let cartProductPrices = [];

  allPrices.forEach(price => cartProductPrices.push(+price.textContent.slice(0, -2)));

  totalPrices = cartProductPrices.reduce((a, b) => a + b)

  totalPrice.innerHTML = `${totalPrices}`
}