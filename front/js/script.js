const homePageProductsSection = document.querySelector('.items');

const fetchHomePageProducts = () => {
  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(products => {

      products.map(product => {

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

    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des produits !");
      console.error(error)
    })
}
fetchHomePageProducts();