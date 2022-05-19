const orderId = document.querySelector('#orderId');
const targetId = window.location.search.split('?').join('');

// Display order id
orderId.innerText = targetId;