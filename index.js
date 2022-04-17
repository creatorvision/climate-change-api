const PORT =  process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'gaurdian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'hindustantimes',
        address: 'https://www.hindustantimes.com/ht-insight/climate-change',
        base: 'https://www.hindustantimes.com'
    },
    {
        name: 'timesofindia',
        address: 'https://timesofindia.indiatimes.com/topic/climate-change/news',
        base: ''
    },
    {
        name: 'dna',
        address: 'https://www.dnaindia.com/topic/climate-change',
        base: 'https://www.dnaindia.com'
    },
    {
        name: 'theeconomist',
        address: 'https://www.economist.com/climate-change',
        base: ''
    },
    {
        name: 'thehindu',
        address: 'https://www.thehindu.com/sci-tech/energy-and-environment/',
        base: ''
    },

]
const articles = []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            // console.log(html)
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url.trim(),
                    source: newspaper.name
                })
            })
        })
})



app.get('/', (req, res) => {
    res.json('Welcome To My Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url.trim(),
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
