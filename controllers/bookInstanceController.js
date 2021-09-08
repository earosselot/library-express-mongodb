const { body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');
const async = require("async");

// Display list of all BookInstances.
exports.bookInstances_list = async (req, res, next) => {
  try {
    const bookInstancesList = await BookInstance
      .find({}, 'book imprint status due_back')
      .populate('book');
    res.render('book_instances_list', { title: 'Book Instances List', bookInstancesList });

  }catch (error) {
    next(error);
  }
};

// Display detail page for a specific BookInstance.
exports.bookInstance_detail = async (req, res, next) => {
  try {
    const bookInstance = await BookInstance.findById(req.params.id).populate('book');
    if (!bookInstance) throw new Error('Book instance not found');
    res.render('book_instance_detail', {title: `Copy: ${bookInstance.book.title}`, bookInstance});
  } catch (error) {
    if (error.message === 'book instance not found') error.status = 404;
    next(error);
  }
};

// Display BookInstance create form on GET.
exports.bookInstance_create_get = async (req, res, next) => {
  try {
    const bookList = await Book.find({});
    res.render('book_instance_form', { title: 'Creata Book Copy', bookList})
  } catch (error) {
    next(error);
  }
};

// Handle BookInstance create on POST.
exports.bookInstance_create_post = [

  // Validate and sanitise fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract the validation errors from the request.
      const errors = validationResult(req);

      // Create a BookInstance object with escaped and trimmed data.
      const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      })

      if (!errors.isEmpty()) {
        // There are errors. Render the form with sanitized values and errors messages.
        const bookList = await Book.find({}, 'title');
        res.render('book_instance_form',
          { title: 'Create book instance',
            selected_book: bookInstance._id,
            bookList,
            bookInstance,
            errors: errors.array() })
      } else {
        // Data is valid. Save book instance.
        await bookInstance.save();
        res.redirect(bookInstance.url);
      }
    } catch (error) {
      next(error);
    }
  }


];

// Display BookInstance delete form on GET.
exports.bookInstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookInstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookInstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookInstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
