const groq = require('groq')
const client = require('../utils/sanityClient.js')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateCategory (category) {
  return {
    ...category,
  }
}

async function getCategory () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "category"]`
  const order = `| order(order asc)`
  const query = [filter, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareCategories = reducedDocs.map(generateCategory)
  return prepareCategories
}

module.exports = getCategory
