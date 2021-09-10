const { body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');


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
  body('book', 'Book must be specified').trim().isLength({ min: 5 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 5 }).escape(),
  body('status').escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    try {
      // Extract the validation errors from the request.
      const errors = validationResult(req);

      // Custom status-date compatibility check.
      if (req.body.status !== 'Available' && !req.body.due_back) {
        errors.errors.push({
          msg: 'If book status is not Available, you should indicate a due date',
        });
      }
      req.body.due_back = req.body.due_back ? `${req.body.due_back}T00:00:00-03:00` : '';

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
exports.bookInstance_delete_get = async (req, res, next) => {
  try {
    const bookInstanceId = req.params.id;
    const bookInstance = await BookInstance.findById(bookInstanceId).populate('book');
    if (!bookInstance) {
      res.redirect('/catalog/bookinstances');
    } else {
      res.render('book_instance_delete.pug', { title: 'Delete Book Instance', bookInstance });
    }
  } catch (error) {
    next(error);
  }
};

// Handle BookInstance delete on POST.
exports.bookInstance_delete_post = async (req, res, next) => {
  try {
    const bookInstanceId = req.body.bookinstanceid;
    await BookInstance.findByIdAndRemove(bookInstanceId);
    res.redirect('/catalog/bookinstances');
  } catch (error) {
    next(error);
  }
};

// Display BookInstance update form on GET.
exports.bookInstance_update_get = async (req, res, next) => {
  try {
    const bookInstanceId = req.params.id;
    const [ bookInstance, bookList ] = await Promise.all([
      BookInstance.findById(bookInstanceId),
      Book.find({})
    ]);
    if (!bookInstance) {
      res.redirect('/catalog/bookinstances');
    } else {
      res.render('book_instance_form', { title: 'Update Book Instance', bookInstance, bookList });
    }
  } catch (error) {
    next(error);
  }
};

// Handle bookinstance update on POST.
exports.bookInstance_update_post = [

  // Validate and sanitise fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim()
    .isLength({ min: 1 }).withMessage('imprint must have at least 4 characters')
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      // Custom status-date compatibility check.
      if (req.body.status !== 'Available' && !req.body.due_back) {
        errors.errors.push({
          msg: 'If book status is not Available, you should indicate a due date',
        });
      }

      // Added this to tell the Book Instance model that the date is in tz -03 (Argentina)
      req.body.due_back = req.body.due_back ? `${req.body.due_back}T00:00:00-03:00` : '';

      const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        due_back: req.body.due_back,
        status: req.body.status,
        _id: req.params.id
      })

      if (!errors.isEmpty()) {
        const bookList = await Book.find({});
        res.render('book_instance_form', { title: 'Update Book Instance', bookInstance, bookList, errors: errors.array() });
      } else {
        const updatedBookInstance = await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {});
        res.redirect(updatedBookInstance.url);
      }
    } catch (error) {
      next(error);
    }
  }

]
