const homePageProductsSection = document.querySelector('.items');
let homePageProductsData = [];

// Retrieve products data from API
const fetchHomePageProducts = async () => {
  await fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(promise => {
      homePageProductsData = promise
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des produits !");
      console.error(error)
    })
}

// Display home page product
const homePageProductsDisplay = async () => {
  await fetchHomePageProducts();

  homePageProductsData.map(product => {

    let homePageCard = document.createElement('a');

    homePageCard.href = `./product.html?${product._id}`;
    homePageCard.innerHTML = `
      <article>
        <img src=${product.imageUrl} alt="${product.altTxt}">
        <h3 class="productName">${product.name}</h3>
       <p class="productDescription">${product.description}</p>
      </article>
    `;

    homePageProductsSection.appendChild(homePageCard);

  })
}
homePageProductsDisplay();