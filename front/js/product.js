const selectedProductId = window.location.search.split('?').join('');
const itemImg = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const select = document.querySelector('#colors');

const fetchProductInfo = () => {
  fetch(`http://localhost:3000/api/products/${selectedProductId}`)
    .then(res => res.json())
    .then(product => {

      let img = document.createElement('img');
      img.src = product.imageUrl;
      itemImg.appendChild(img);

      title.innerText = product.name;
      price.innerText = product.price;
      description.innerText = product.description;

      product.colors.forEach(color => {
        let options = document.createElement('option');

        options.innerText = color;
        options.value = color;

        select.appendChild(options)
      })

    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des produits !");
      console.error(error)
    })
}
fetchProductInfo();