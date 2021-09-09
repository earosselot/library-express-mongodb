const { body, validationResult } = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
exports.genre_list = async (req, res, next) => {
  try {
    const genreList = await Genre.find({}).sort([['name', 'descending']]);
    res.render('genre_list', {title: 'Genre List', genreList});
  } catch (error) {
    next(error);
  }
};

// Display detail page for a specific Genre.
exports.genre_detail = async (req, res, next) => {
  try {
    const [ genre, genreBooks ] = await Promise.all([
      Genre.findById(req.params.id),
      Book.find({'genre': req.params.id}),
    ]);
    if (!genre) throw new Error('Genre not found');
    res.render('genre_detail', {title: 'Genre Details', genre, genreBooks})
  } catch (error) {
    if (error.message === 'Genre not found') error.status = 404;
    next(error);
  }
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
  res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [

  // Validate and sanitize the name field
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  // Process req after validation
  async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      const genre = new Genre(
        { name: req.body.name }
      );

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      } else {
        const foundGenre = await Genre.findOne({ 'name': req.body.name});
        if (foundGenre) {
          // Genre exists, redirect to its detail page.
          res.redirect(foundGenre.url);
        } else {
          // Genre doesn't exists, save it.
          await genre.save();
          res.redirect(genre.url);
        }
      }
    } catch (error) {
      next(error);
    }
  }
]

// Display Genre delete form on GET.
exports.genre_delete_get = async (req, res,next) => {
  try {
    const genreId = req.params.id;
    const [ genre, genreBooks ] = await Promise.all([
      Genre.findById(genreId),
      Book.find({'genre': genreId})
    ]);
    if(!genre) {
      res.redirect('/catalog/genres');
    } else {
      res.render(
        'genre_delete',
        { title: 'Delete Genre', genre, genreBooks }
      );
    }
  } catch (error) {
    next(error);
  }
};

// Handle Genre delete on POST.
exports.genre_delete_post = async (req, res, next) => {
  try {
    const genreId = req.body.genreid;
    const [ genre, genreBooks ] = await Promise.all([
      Genre.findById(genreId),
      Book.find({'genre': genreId})
    ]);
    if (genreBooks.length > 0) {
      res.render('genre_delete', { title: 'Delete Genre', genre, genreBooks});
    } else {
      await Genre.findByIdAndRemove(genreId);
      res.redirect('/catalog/genres');
    }
  } catch (error) {
    next(error);
  }
};

// Display Genre update form on GET.
exports.genre_update_get = async (req, res, next) => {
  try {
    const genreId = req.params.id;
    const genre = await Genre.findById(genreId);
    if (!genre) {
      res.redirect('/catalog/genres');
    } else {
      res.render('genre_form', { title: 'Update Genre', genre });
    }
  } catch (error) {
    next(error);
  }
};

// Handle Genre update on POST.
exports.genre_update_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const genre = new Genre({
        name: req.body.name,
        _id: req.params.id,
      })
      if(!errors.isEmpty()) {
        res.render('genre_form', { title: 'Update Genre', genre, errors});
      } else {
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
        res.redirect(updatedGenre.url);
      }
    } catch (error) {
      next(error);
    }
  }
]