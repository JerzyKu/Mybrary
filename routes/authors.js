const express = require('express')
const Author = require('../models/author')
const Book = require('../models/book')
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
        redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).exec()
        console.log(books);
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
    // res.send('Show Author ' + req.params.id)
})

router.get('/:id/edit', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id)
    res.render("authors/edit", { author: author })
        
    } catch (error) {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (e){
        console.log(e);
        if (author == null){
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch (e){
        console.log(e);
        if (author == null){
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})



module.exports = router