const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../utils/sanityClient.js')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateProduct (product) {
  return {
    ...product,
  }
}

async function getProducts () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "product"]{
    category {
    "title": ^->title,
    },
    price,
    title,
    description,
    order,
    featured,
    default_thumbnail_image,
    default_original_image
  }`
  const order = `| order(order asc)`
  const query = [filter, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareProducts = reducedDocs.map(generateProduct)
  return prepareProducts
}

module.exports = getProducts
