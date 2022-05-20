const selectedProductId = window.location.search.split('?').join('');
const itemImg = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const select = document.querySelector('#colors');

let productData = [];

// Retrieve products data by selected id
const fetchProductData = async () => {
  await fetch(`http://localhost:3000/api/products/${selectedProductId}`)
    .then(res => res.json())
    .then(promise => {
      productData = promise;
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération du produit !");
      console.error(error)
    })
}

// Display product sheet
const productDisplay = async () => {
  await fetchProductData();

  let img = document.createElement('img');
  img.src = productData.imageUrl;
  itemImg.appendChild(img);

  title.innerText = productData.name;
  price.innerText = productData.price;
  description.innerText = productData.description;

  productData.colors.forEach(color => {
    let options = document.createElement('option');
    options.innerText = color;
    options.value = color;
    select.appendChild(options)
  })

  addCart(productData);

}
productDisplay();

// Add a product to cart
const addCart = async () => {
  await fetchProductData();

  let button = document.querySelector('#addToCart');
  let cart = JSON.parse(localStorage.getItem('product')) || [];

  button.addEventListener('click', () => {
    let selectedColor = document.querySelector('#colors');
    let selectedQuantity = document.querySelector('#quantity');
    let storedValues = {
      id: productData._id,
      color: selectedColor.value,
      quantity: +selectedQuantity.value
    }

    if (storedValues.color === '') return alert("Veuillez choisir un couleur.");
    if (storedValues.quantity <= 0) return alert("Veuillez choisir une quantité.");

    if ((cart.some(item => item.id === storedValues.id && item.color === storedValues.color))) {

      cart.forEach(item => {
        if (item.color === storedValues.color) {
          item.quantity += storedValues.quantity;
        }
      })

    } else {
      console.log(false);
      cart.push(storedValues);
    }

    localStorage.setItem('product', JSON.stringify(cart))
  })
}