const express = require('express')
const Author = require('../models/author')
const router = express.Router()

// All authors route
router.get('/', async (req, res) => {
    const searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions).sort({ "name": 1 }) // all
        res.render("authors/index", { 
            authors: authors,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
        console.log(error)
        // res.render('authors/new', {errorMessage: "All err"})
    }

})

// new authors route
router.get('/new', (req, res) => {
    res.render("authors/new", { author: new Author() })
})

//Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: 'Error creating Author'
    //         })
    //     } else {
    //         // res.redirect(`authors/${newAuthor.id}`)
    //         res.redirect(`authors`)
    //     }
    // })
})

module.exports = router