const axios = require('axios')
const cheerio = require('cheerio')

const config = {
  headers: {
    'Accept-Charset': 'utf-8',
    // 'Accept-Language': 'en-US;q=0.5,en;q=0.3',
    'User-Agent': 'Mozilla/5.0',
  },
}

const main = async () => {
  const query = 'como kitchen'
  console.log(`0. recherche pour ===> "${query}"`)

  const [deliveroo, ubereats] = await Promise.all([scrapDeliveroo(query), scrapUbereats(query)])
  console.log(`1. deliveroo url ===> ${deliveroo.url}`)
  console.log(`1. deliveroo title ===> ${deliveroo.title}`)
  console.log(`1. deliveroo rating ===> ${deliveroo.rating}`)
  console.log(`1. deliveroo count ===> ${deliveroo.count}`)
  console.log(`2. ubereats url ===> ${ubereats.url}`)
  console.log(`2. ubereats title ===> ${ubereats.title}`)
  console.log(`2. ubereats rating ===> ${ubereats.rating}`)
  console.log(`2. ubereats count ===> ${ubereats.count}`)
  return 0
}

const scrapUbereats = async (query) => {
  const urls = await search(query + ' uber eats')
  const url = urls[0]
  const res = await axios.get(url, config)
  const $ = cheerio.load(res.data)
  const title = $('h1').text()
  let structuredData = $('script[type="application/ld+json"]')[0].children[0].data
  structuredData = JSON.parse(structuredData)
  const rating = structuredData.aggregateRating.ratingValue
  const count = structuredData.aggregateRating.reviewCount

  return { url, title, rating, count }
}

const scrapDeliveroo = async (query) => {
  const urls = await search(query + ' deliveroo')
  const url = urls[0]
  const res = await axios.get(url, config)
  const $ = cheerio.load(res.data)
  const title = $('h1').text()
  const rating = $('h1').next().text().split('(')[0]
  const count = $('h1').next().text().split('(')[1].split('+')[0]

  return { rating, count, title, url }
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

main()
