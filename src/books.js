const BooksController = require('./BooksController');

const booksRoutes = [
    {
        method: 'GET',
        path: '/books',
        handler: BooksController.index,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: BooksController.show,
    },
    {
        method: 'POST',
        path: '/books',
        handler: BooksController.store,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: BooksController.update,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: BooksController.destroy,
    },
];

module.exports = booksRoutes;
