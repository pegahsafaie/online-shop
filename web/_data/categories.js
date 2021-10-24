
const fetch = require('node-fetch');
require('dotenv').config();

const postToShopify= async ({ query, variables }) => {
  try {
    const result = await fetch('https://fead98efbc2f255c200e225ab3194bc4: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@likorbar.myshopify.com/admin/api/2021-10/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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