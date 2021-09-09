const { body, validationResult } = require('express-validator');
const Author = require('../models/author');
const Book = require('../models/book');

// Display list of all authors
exports.author_list = async (req, res, next) => {
  try {
    const authorList = await Author.find({} ).sort([['family_name', 'ascending']]);
    res.render('author_list', { title: 'Authors List', authorList })
  } catch (error) {
    next(error);
  }
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
  try {
    const [ author, authorBooks ] = await Promise.all([
      Author.findById(req.params.id),
      Book.find({'author': req.params.id})
    ]);
    if (!author) throw new Error('Author not found');
    res.render('author_detail', {title: 'Author details', author, authorBooks});
  } catch (error) {
    if (error.message === 'Author not found') error.status = 404;
    next(error);
  }
};

// Display Author create form on GET
exports.author_create_get = (req, res) => {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST
exports.author_create_post = [

  // Validate and sanitize fields.
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name is required.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name is required.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true}).isISO8601().toDate(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true}).isISO8601().toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array()});
        return;
      }
      else {
        const author = new Author({
          first_name: req.body.first_name,
          family_name: req.body.family_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death
        });
        await author.save();
        res.redirect(author.url);
      }
    } catch (error) {
      next(error);
    }
  }
];

// Display Author delete form on GET.
exports.author_delete_get = async (req, res, next) => {
  try {
    const [ author, authorBooks ] = await Promise.all([
      Author.findById(req.params.id),
      Book.find({ 'author': req.params.id })
    ]);
    if (!author) {
      res.redirect('/catalog/authors');
    } else {
      res.render('author_delete', { title: 'Delete Author', author, authorBooks });
    }
  } catch (error) {
    next(error);
  }
}

// Handle Author delete form on POST.
exports.author_delete_post = async (req, res, next) => {
  try {
    const [ author, authorBooks ] = await Promise.all([
      Author.findById(req.body.authorid),
      Book.find({ 'author': req.body.authorid })
    ]);
    if (authorBooks.length > 0) {
      res.render('author_delete', { title: 'Delete Author', author, authorBooks });
    } else {
      await Author.findByIdAndRemove(req.body.authorid);
      res.redirect('/catalog/authors');
    }
  } catch (error) {
    next(error);
  }
};

// Display Author update on GET.
exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED AUTHOR update GET');
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED AUTHOR update POST');
};














