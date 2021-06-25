
async function convertCurrency(products, currency) {
    const usdRatesResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const usdRates = await usdRatesResponse.json();
    const currRate = usdRates.rates[currency];
    return products.map( product => {
        product.convertedPrice = (product.price * currRate).toFixed(2);
        return product;
    });
}

async function renderProducts(products, sortDirection = 'ascending') {
    const currency = document.querySelector('.currency').value;
    const convertedProducts = await convertCurrency(products, currency);
    const sortedProducts = [...convertedProducts].sort( (a, b ) => 
        sortDirection === 'ascending' ? a.price - b.price : b.price - a.price
    );
    let productsHtml = '';
    for (const product of sortedProducts) {
        productsHtml += `
            <article>
                <img src="${product.imgUrl}" alt="${product.title}" />
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="buttons">
                    <button class="button card-button">Info</button>
                    <button class="button card-button">Buy - ${product.convertedPrice}</button>
                </div>
        </article>`;
    }
    document.querySelector('.products').innerHTML = productsHtml;
}

async function initProducts() {
    const response = await fetch('products.json');
    const products = await response.json();
    renderProducts(products, 'ascending');
    document
        .querySelector('.sort-asc')
        .addEventListener('click', () => renderProducts(products, 'ascending'));
    document
        .querySelector('.sort-desc')
        .addEventListener('click', () => renderProducts(products, 'descending'));
    document   
        .querySelector('.convert')
        .addEventListener('click', () => renderProducts(products))
}

// AJAX Sample:
// function initProducts() {
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             const products = JSON.parse(xhr.responseText);
//             renderProducts(products, 'ascending');
//             document
//                 .querySelector('.sort-asc')
//                 .addEventListener('click', () => renderProducts(products, 'ascending'));
//             document
//                 .querySelector('.sort-desc')
//                 .addEventListener('click', () => renderProducts(products, 'descending'));
//         }
//     }
//     xhr.open('GET', 'products.json', true);
//     xhr.send();
// }

initProducts();

// fetch('products.json')
//     .then( response => response.json() )
//     .then( productList => {
//         products = productList;
//         renderProducts(products, 'ascending');
//     });

