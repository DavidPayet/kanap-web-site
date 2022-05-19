const orderId = document.querySelector('#orderId');

orderId.innerText = window.location.search.split('?').join('');