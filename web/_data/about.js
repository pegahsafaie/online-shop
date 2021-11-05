const groq = require('groq')
const client = require('../utils/sanityClient.js')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateAbout (about) {
  return {
    ...about,
  }
}

async function getAbouts () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const query = groq`*[_type == "about"]`
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareAbouts = reducedDocs.map(generateAbout)
  return prepareAbouts
}

module.exports = getAbouts
