const express = require('express');
const router = express.Router();

// Require controller modules.
const book_controller = require('../controllers/bookController');
const author_controller = require('../controllers/authorController');
const genre_controller = require('../controllers/genreController');
const book_instance_controller = require('../controllers/bookInstanceController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
// POST request for creating Book.
router.route('/book/create')
  .get(book_controller.book_create_get)
  .post(book_controller.book_create_post);

// GET request to delete Book.
// POST request to delete Book.
router.route('/book/:id/delete')
  .get(book_controller.book_delete_get)
  .post(book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
// POST request for creating Author.
router.route('/author/create')
  .get(author_controller.author_create_get)
  .post(author_controller.author_create_post);

// GET request to delete Author.
// POST request to delete Author.
router.route('/author/:id/delete')
  .get(author_controller.author_delete_get)
  .post(author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookInstance/create', book_instance_controller.bookInstance_create_get);

// POST request for creating BookInstance.
router.post('/bookInstance/create', book_instance_controller.bookInstance_create_post);

// GET request to delete BookInstance.
router.get('/bookInstance/:id/delete', book_instance_controller.bookInstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookInstance/:id/delete', book_instance_controller.bookInstance_delete_post);

// GET request to update BookInstance.
router.get('/bookInstance/:id/update', book_instance_controller.bookInstance_update_get);

// POST request to update BookInstance.
router.post('/bookInstance/:id/update', book_instance_controller.bookInstance_update_post);

// GET request for one BookInstance.
router.get('/bookInstance/:id', book_instance_controller.bookInstance_detail);

// GET request for list of all BookInstance.
router.get('/bookInstances', book_instance_controller.bookInstances_list);

module.exports = router;