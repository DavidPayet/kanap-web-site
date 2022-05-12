const cartItems = document.querySelector('#cart__items');

let cartProduct = JSON.parse(localStorage.getItem('product')) || [];
let cartProductData = [];

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

  modifyStoredQuantity()

}
cartDisplay();



const modifyStoredQuantity = () => {
  const itemsQuantity = document.querySelectorAll('.itemQuantity');
  const articles = document.querySelectorAll('article');

  for (let i = 0; i < articles.length; i++) {
    for (let j = 0; j < cartProduct.length; j++) {
      if (articles[i].dataset.id === cartProduct[j].id && articles[i].dataset.color === cartProduct[j].color) {

        itemsQuantity[i].addEventListener('change', (e) => {
          cartProduct[j].quantity = +e.target.value
          localStorage.setItem('product', JSON.stringify(cartProduct))
        })

      }
    }
  }
}