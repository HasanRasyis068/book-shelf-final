const uuid = require('./uuid');
const books = [];

const BooksController = {
    index: (request, h) => {
        const { name, reading, finished } = request.query;

        let filteredBooks = books;

        if (name) {
            filteredBooks = filteredBooks.filter(book =>
                book.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        
        if (reading != undefined) {
            const isReading = reading === '1';
            filteredBooks = filteredBooks.filter(book => book.reading === isReading);
        }

        if (finished != undefined) {
            const isFinished = finished === '1';
            filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
        }

        return h.response({
            status: 'success',
            data: {
                books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
            },
        }).code(200);
    },
    show: (request, h) => {
        const { id } = request.params;
        const book = books.find((b) => b.id === id);

        if (!book) {
            return h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: { book },
        }).code(200);
    },
    store: (request, h) => {
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            }).code(400);
        }

        const id = uuid();
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage;

        const newBook = {
            id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
        };

        books.push(newBook);

        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    },
    update: (request, h) => {
        const { id } = request.params;
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        const bookIndex = books.findIndex((b) => b.id === id);

        if (bookIndex === -1) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            }).code(404);
        }

        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            }).code(400);
        }

        const updatedAt = new Date().toISOString();
        books[bookIndex] = { ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, finished: pageCount === readPage, updatedAt };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    },
    destroy: (request, h) => {
        const { id } = request.params;
        const bookIndex = books.findIndex((b) => b.id === id);

        if (bookIndex === -1) {
            return h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan',
            }).code(404);
        }

        books.splice(bookIndex, 1);

        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    },
};

module.exports = BooksController;
