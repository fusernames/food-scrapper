const axios = require('axios')
const cheerio = require('cheerio')

const config = {
  headers: {
    'Accept-Charset': 'utf-8',
    'Accept-Language': 'en-US,en;q=0.8,en-GB;q=0.8,*;q=0.7',
    'User-Agent': 'Mozilla/5.0',
  },
}

const main = async () => {
  let args = process.argv.slice(2)
  const query = args[0] || 'como kitchen'
  console.log('args =>', args)
  console.log(`0. recherche pour ===> "${query}"`)

  const [deliveroo, ubereats, tripadvisor] = await Promise.all([
    scrapDeliveroo(query),
    scrapUbereats(query),
    scrapTripadvisor(query),
  ])

  console.log(`1. deliveroo ${JSON.stringify(deliveroo, null, 4)}`)
  console.log(`2. ubereats ${JSON.stringify(ubereats, null, 4)}`)
  console.log(`3. tripadvisor ${JSON.stringify(tripadvisor, null, 4)}`)
  return 0
}

const scrapTripadvisor = async (query) => {
  try {
    const urls = await search(query + ' tripadvisor')
    const url = urls[0]
    const res = await axios.get(url, config)
    const $ = cheerio.load(res.data)
    const ratingElem = $('a[href="#REVIEWS"]').last()
    const rating = Number(ratingElem.prev().prev().text()) // works with US format only
    const count = Number(ratingElem.text().split(' ')[0])
    let structuredData = getStructuredData($)
    const title = structuredData.name
    const address = structuredData.address
    return { title, rating, count, url, address }
  } catch (e) {
    return null
  }
}

const scrapUbereats = async (query) => {
  try {
    const urls = await search(query + ' uber eats')
    const url = urls[0]
    const res = await axios.get(url, config)
    const $ = cheerio.load(res.data)
    // const title = $('h1').text()
    let structuredData = getStructuredData($)
    const rating = structuredData.aggregateRating.ratingValue
    const count = structuredData.aggregateRating.reviewCount
    const title = structuredData.name
    const address = structuredData.address

    return { title, rating, count, url, address }
  } catch (e) {
    return null
  }
}

const scrapDeliveroo = async (query) => {
  try {
    const urls = await search(query + ' deliveroo')
    const url = urls[0]
    const res = await axios.get(url, config)
    const $ = cheerio.load(res.data)
    const title = $('h1').text()
    const rating = $('h1').next().text().split('(')[0]
    const count = $('h1').next().text().split('(')[1].split('+')[0]

    return { title, rating, count, url }
  } catch (e) {
    return null
  }
}

const search = async (query) => {
  const res = await axios.get(`https://www.google.com/search?q=${encodeURI(query)}`, config)
  const $ = cheerio.load(res.data)
  const urls = []
  $('h3').each(function () {
    let url = $(this).parent().attr('href')
    let text = $(this).text()
    if (url) urls.push(url.split('/url?q=')[1].split('&')[0])
    // console.log(`title => ${text}`, `url => ${url}`)
  })
  return urls
}

const getStructuredData = ($) => JSON.parse($('script[type="application/ld+json"]')[0].children[0].data)

main()
