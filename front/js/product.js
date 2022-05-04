const selectedProductId = window.location.search.split('?').join('');
const itemImg = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const select = document.querySelector('#colors');

let productData = [];

const fetchProductData = async () => {
  await fetch(`http://localhost:3000/api/products/${selectedProductId}`)
    .then(res => res.json())
    .then(promise => {
      productData = promise;
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des produits !");
      console.error(error)
    })
}

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


const addCart = async() => {
  await fetchProductData();

  let button = document.querySelector('#addToCart');
  let cart = JSON.parse(localStorage.getItem('products')) || [];

  button.addEventListener('click', () => {
    let selectedColor = document.querySelector('#colors');
    let selectedQuantity = document.querySelector('#quantity');
    console.log(selectedColor.value, selectedQuantity.value);

    const selectedOptions = {
      id: productData._id,
      color: selectedColor.value,
      quantity: selectedQuantity.value
    }

    cart.push(selectedOptions);
    localStorage.setItem('products', JSON.stringify(cart))

    console.log(cart);
  })
}