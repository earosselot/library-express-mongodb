const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const { body, validationResult } = require("express-validator");


exports.index = async (req, res) => {
  try {
    const [ bookCount, bookInstanceCount, bookInstanceAvailableCount, authorCount, genreCount ] =
      await Promise.all([
        Book.countDocuments({}),
        BookInstance.countDocuments({}),
        BookInstance.countDocuments({status: 'available'}),
        Author.countDocuments({}),
        Genre.countDocuments({})
      ])
    res.render('index', { title: 'Library Home', bookCount, bookInstanceCount, bookInstanceAvailableCount, authorCount, genreCount});
  } catch (error) {
    res.render('index', { error });
  }
};

// Display list of all books.
exports.book_list = async (req, res, next) => {
  try {
    const list_books = await Book.find({}, 'title author').populate('author');

    list_books.sort((a, b) => {
      let textA = a.title.toUpperCase();
      let textB = b.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    res.render('book_list', {title: 'Book List', list_books});
  } catch (error) {
    next(error);
  }
};

// Display detail page for a specific book.
exports.book_detail = async (req, res, next) => {
  try {
    const [ book, bookInstances ] = await Promise.all([
      Book.findById(req.params.id).populate('author').populate('genre'),
      BookInstance.find({'book': req.params.id})
    ]);
    if (!book) throw new Error('book not found');
    res.render('book_detail', {title: 'Book Details', book, bookInstances});
  } catch (error) {
    if (error.message === 'book not found') error.status = 404;
    next(error);
  }
};

// Display book create form on GET.
exports.book_create_get =  async (req, res, next) => {
  try {
    const [ authors, genres ] = await Promise.all([
      Author.find({}),
      Genre.find({})
    ]);
    res.render('book_form', { title: 'Create Book', authors, genres });
  } catch (error) { next(error) };
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array
  (req, res, next) => {
    console.log('req.body.genre: ', req.body.genre);
    if (typeof req.body.genre === 'undefined')
      req.body.genre = [];
    // TODO: Corregir MDN. no hay que hacer el else new Array porque req.body.gendre ya viene como un array.
    //  Si le dejas el else, depues el sanitizador te deja solo el primer campo del array.
    //  Como que en realidad armas un array con 1 solo elemento.
    // https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms/Create_book_form
    // else
    //   req.body.genre = new Array(req.body.genre);
    next();
  },

  // Validate and sanitise fields.
  body('title', 'Title must not be empty').trim().isLength({ min: 8 }).escape(),
  body('author', 'Author must not be empty').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1}).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract validation errors from request.
      const errors = validationResult(req);

      // Create a Book object with escaped and trimmed data.
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre
      })
      if (!errors.isEmpty()) {
        // There was validation errors.
        const [ authors, genres ] = await Promise.all([
          Author.find({}),
          Genre.find({})
        ]);
        genres.map(genre => {
          void(book.genre.includes(genre._id.toString()) && (genre.checked = 'true'))
        });
        res.render('book_form', { title: 'Create Book 2', book, authors, genres });
      }
      else {
        // Data from form is valid. Save Book.
        await book.save();
        res.redirect(book.url);
      }
    } catch (error) {
      next(error);
    }
  }
]

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Book update POST');
};
