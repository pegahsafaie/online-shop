const groq = require('groq')
const client = require('../utils/sanityClient.js')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateFAQ (FAQ) {
  return {
    ...FAQ,
  }
}

async function getFAQ () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const query = groq`*[_type == "faq"]`
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareFAQs = reducedDocs.map(generateFAQ)
  return prepareFAQs
}

module.exports = getFAQ
