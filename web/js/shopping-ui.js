(function(){

  getCartSummaryDetails();
  
  const buyButtons = document.getElementsByClassName('snipcart-add-item');
  
  for (var b = 0; b < buyButtons.length; b++) {
    // add form event listeners
    buyButtons[b].addEventListener('click', postToCart);

    // if we have a cartId stashed, we should add it to any cart form on this page
    // forms[f].elements['cartId'].value = localStorage.getItem('shopifyCartId') || "";
    
  }
})();


// fetch cart data from the API
function getCartSummaryDetails() {
  if (localStorage.getItem('shopifyCartId')){
    getCart({
      'cartId': localStorage.getItem('shopifyCartId')
    }).then(data => { 
      if(data.cart) {
        displayCartSummaryDetails(data.cart.lines.edges.length, data.cart.id);
      }
      else {
        //clear a local cart if it has expired with Shopify
        localStorage.removeItem('shopifyCartId');
      }
    });
  } else {
    console.log(`No shopping cart yet`);
  }
}


// Update the UI with latest cart info
function displayCartSummaryDetails(count, id) {
  const cartLink = document.getElementsByClassName('snipcart-checkout')[0];
  const cartSize = document.getElementsByClassName('snipcart-items-count')[0];
  if (cartLink) {
    cartLink.addEventListener('click', switchToCartView, false);
  }
  if (cartSize) {
    cartSize.innerHTML = `${count}`;
  }
}

// Send an item to the cart API
function postToCart(event) {
  event.preventDefault();
  

  const data = {
    cartId: localStorage.getItem('shopifyCartId') || null,
    itemId: event.target.parentNode.getAttribute('data-item-id'),
    quantity: 1,
  };

  console.log(data);

  addToCart(data)
  .then((result) => {
    // persist that cartId for subsequent actions
    localStorage.setItem('shopifyCartId', result.id);
    // update the cart ;abel in the navigation
    displayCartSummaryDetails(result.lines.edges.length, result.id);
  });
};

function addToCart({ cartId, itemId, quantity }) {
  quantity = parseInt(quantity);
  

  if (cartId) {
    console.log('--------------------------------')
    console.log('Adding item to existing cart...')
    console.log('--------------------------------')

    return addItemToCart({
      cartId,
      itemId,
      quantity,
    }).then(shopifyResponse => {  
      return shopifyResponse.cartLinesAdd.cart
    })

  } else {
    console.log('--------------------------------')
    console.log('Creating new cart with item...')
    console.log('--------------------------------')

    console.log(itemId, quantity);
    
    return createCartWithItem({
      itemId,
      quantity,
    }).then(createCartResponse => {
      return createCartResponse.cartCreate.cart
    })

    
  }
}

async function addItemToCart ({ cartId, itemId, quantity }) {
  try {
    const shopifyResponse = postToShopify({
      query: `
        mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        priceV2 {
                          amount
                          currencyCode
                        }
                        product {
                          title
                          handle
                        }
                      }
                    }
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `,
      variables: {
        cartId,
        lines: [
          {
            merchandiseId: itemId,
            quantity,
          },
        ],
      },
    })

    return shopifyResponse
  } catch (error) {
    console.log(error)
  }
}


async function createCartWithItem({ itemId, quantity }) {
  try {
    return postToShopify({
      query: `
        mutation createCart($cartInput: CartInput) {
          cartCreate(input: $cartInput) {
             cart {
              id
              createdAt
              updatedAt
              lines(first:10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        priceV2 {
                          amount
                          currencyCode
                        }
                        product {
                          id
                          title
                        }
                      }
                    }
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `,
      variables: {
        cartInput: {
          lines: [
            {
              quantity,
              merchandiseId: itemId,
            },
          ],
        },
      },
    });

  } catch (error) {
    console.log(error)
  }
}


function getCart({ cartId }) {
  
  try {
    console.log('--------------------------------')
    console.log('Retrieving existing cart...')
    console.log('--------------------------------')
    return postToShopify({
      query: `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              src
                              altText
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
            checkoutUrl
          }
        }
      `,
      variables: {
        cartId,
      },
    });
  } catch (error) {
    console.log(error)
  }
}

async function postToShopify ({ query, variables }) {
  try {
    const result = await fetch('https://likorbar.myshopify.com/api/2021-10/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
        '84a744a6f1aed8924d74114dfd84ddd1'
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    if (result.errors) {
      console.log({ errors: result.errors })
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    }

    return result.data
  } catch (error) {
    console.log(error)
  }
}


function switchToCartView() {
  const cartId = localStorage.getItem('shopifyCartId') || "";
  cartView({cartId}).then(result => {
    document.getElementsByClassName('content')[0].innerHTML = result;
  })
}

function cartView ({cartId}) {

   return getCart({cartId}).then(result => {
    

    const itemTotal = function(price, quantity) {
      const totalPrice = Number(price) * Number(quantity)
      return totalPrice.toFixed(2)
    }


    const cartItem = (cartId, item) => {
      const displayTitleModifier = item.merchandise.title == "Default Title" ? "" : item.merchandise.title;
      return ` <tr class="cart-table-row">
      <td class="cart-table-cell">
        <a href"=/products/${item.merchandise.product.handle}">
          ${ item.merchandise.product.title }
        </a>
      </td>
      <td class="cart-table-cell">
        ${item.merchandise.priceV2.amount}
      </td>
      <td class="cart-table-cell">${ item.quantity }</td>
      <td class="cart-table-cell">
        ${ itemTotal(item.merchandise.priceV2.amount, item.quantity) }
      </td>
      <td class="cart-table-cell">
        <form action="/api/remove-from-cart" method="POST">
          <input type="hidden" name="cartId" value="${cartId}">
          <input type="hidden" name="lineId" value="${item.id}">
          <input type="submit" value="Remove item">
        </form>
      </td>
    </tr>
  `};
    
    const cartTotals = (cart) => {
      
      if (!cart.lines.edges.length) {
        console.log(`No basket`);
        return `<div class="cart-total-content">
          <div class="cart-total-column">
            <a href="/">What you need is some meats and cheeses!</a>
          </div>
        </div>`;
      }

      return `
      <div class="cart-total-content">
        <div class="cart-total-column">
          <p>
            <strong>${cart.estimatedCost.subtotalAmount.amount} ${cart.estimatedCost.totalAmount.currencyCode} </strong>
          </p>
          <p>Free Shipping</p>
        </div>
      </div>`;
    }

    
    let items = "";
      result.cart.lines.edges.forEach(item => {
      items += cartItem(result.cart.id, item.node)
    });

  


    const pageTemplate = (items, totals) => {return `
    <div id="snipcart" class="snipcart">
    <section class="content__row header-section__header" style="background-image: url('/images/leaf-light-grey.svg')" data-id="header_section">
      <h1 class="header-section__title content__row">Your Cart</h1>

      <div class="snipcart-cart__content" >
    
        <table >
        <thead>
          <th class="cart-table-heading">Item</th>
          <th class="cart-table-heading">Price</th>
          <th class="cart-table-heading">Quantity</th>
          <th class="cart-table-heading">Total</th>
          <th class="cart-table-heading">Actions</th>
        </thead>
        <tbody>
        ${items}
        </tbody>
        </table>
        <section class="cart-total">
        ${cartTotals(result.cart)}
        <footer>
          <a class="snipcart-cart-button snipcart__font--bold snipcart__font--secondary snipcart-cart-button--large snipcart-cart-button--highlight snipcart-cart-button--spaced snipcart__font--large" href="${result.cart.checkoutUrl}">
            <span class="snipcart-cart-button__grid">

            <span class="snipcart-cart-button__content">Checkout</span>
            <svg width="26" height="14" viewBox="0 0 26 14" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.682 6.079h-22.682v1.712h22.814l-4.574 4.528 1.194 1.182 6.566-6.5-6.566-6.5-1.194 1.182 4.442 4.397z"></path>
            </svg>                    

            </span>
          </a>
        </footer>
        </section>
      </div>

</section>
</div>
         `};
      
    return pageTemplate(items, result.cart.estimatedCost);

    })
  
  
}