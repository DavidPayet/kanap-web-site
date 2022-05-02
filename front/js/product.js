const selectedProductId = window.location.search.split('?').join('');
const itemImg = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const select = document.querySelector('#colors');

let productData = [];

const fetchProductInfo = () => {
  fetch(`http://localhost:3000/api/products/${selectedProductId}`)
    .then(res => res.json())
    .then(promise => {

      productData = promise;

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

    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des produits !");
      console.error(error)
    })
}
fetchProductInfo();


const addCart = () => {
  let button = document.querySelector('#addToCart');

  button.addEventListener('click', () => {
    let productsArray = JSON.parse(localStorage.getItem('products'))
    let selectedColor = document.querySelector('#colors');
    let selectedQuantity = document.querySelector('#quantity')
    console.log(selectedColor.value);
    console.log(selectedQuantity.value);

    const selectedOptions = Object.assign({}, productData, {
      color: selectedColor.value,
      quantity: selectedQuantity.value
    })

    productsArray = [];
    productsArray.push(selectedOptions);
    localStorage.setItem('products', JSON.stringify(productsArray))

    console.log(productsArray);
  })
}