var BookInstance = require('../models/bookinstance');
var Book = require('../models/book')
const { body, validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')


exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
        if (err) { return next(err); }
        res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances})
    })
}

exports.bookinstance_detail = function(req, res) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
        if (err) { return next(err); }
        res.render('bookinstance_detail', {title: 'Copy' + bookinstance.book.title, bookinstance: bookinstance });
    })
}

exports.bookinstance_create_get = function(req, res) {
    Book.find({}, 'title')
    .exec(function (err, books) {
        if (err) { return next(err) };
        res.render('bookinstance_form', {title: 'Create Bookinstance', book_list:books})
    })
}

exports.bookinstance_create_post = [
    body('book', 'Book must be specifed').trim().isLength({min: 1}),
    body('imprint', 'Imprint must be specified').trim().isLength({min: 1}),
    body('due_back', 'Invalid Date').optional({checkFalsy: true}).isISO8601(),
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').escape(),
    sanitizeBody('due_back').toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        })

        if (!errors.isEmpty()) {
            Book.find({}, 'title')
                .exec(function(err, books) {
                    if (err) { return next(err) }
                    res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books, selected_book: bookinstance.id, errors: errors.array(), bookinstance: bookinstance})
                })
            return;
        } else {
            bookinstance.save(function(err) {
                if (err) { return next(err); }
                res.redirect(bookinstance.url);
            })
        }
    }
    
]

exports.bookinstance_delete_get = function(req, res) {
    res.send('TODO: bookinstance_delete_get');
}

exports.bookinstance_delete_post = function(req, res) {
    res.send('TODO: bookinstance_delte_post');
}

exports.bookinstance_update_get = function(req, res) {
    res.send('TODO: bookinstance_update_get');
}

exports.bookinstance_update_post = function(req, res) {
    res.send('TODO: bookinstance_update_post');
}