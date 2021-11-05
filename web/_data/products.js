
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

  const response = await postToShopify({
    query: `{
      products (sortKey: TITLE, first: 100) {
        edges {
          node {
            variants(first:1) {edges{node{id}}}
            title
            description
            productType
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            tags
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
    }`,
    variables: null
  });
  
  const convertedProducts= response.products.edges.map(({node}, i) => ({
    id: node.variants.edges[0].node.id,
    price: node.priceRange.minVariantPrice.amount,
    description: node.description,
    title: node.title,
    order: i,
    featured: node.tags.includes('bestseller'),
    category: { title: node.productType },
    default_thumbnail_image: node.images.edges[0].node.src,
    default_original_image: node.images.edges[0].node.src
  }));
  return convertedProducts;

};