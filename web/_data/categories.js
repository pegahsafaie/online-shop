
const fetch = require('node-fetch');
require('dotenv').config();

const postToShopify= async ({ query, variables }) => {
  try {
    const result = await fetch("https://likorbar.myshopify.com/api/2021-10/graphql.json", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
        '84a744a6f1aed8924d74114dfd84ddd1'
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    return result.data
  } catch (error) {
    console.log(error)
  }
}

module.exports = async () => {

  const result = await postToShopify({
    query: `{
      shop {
        products(first:250, query:"-product_type:''") {
          edges {
              node {
                productType
            }
          }
        }
      }
    }`,
    variables: null
  });

  const productTypes = new Set(result.shop.products.edges.map(({node}) => (node.productType)));
  
  const convertedProductTypes = Array.from(productTypes).map((productType, i) => ({
    title: productType,
    order: i,
    featured: true,
    permalink: `/store/categories/${productType}/index.html`
  }));

  return convertedProductTypes;
};