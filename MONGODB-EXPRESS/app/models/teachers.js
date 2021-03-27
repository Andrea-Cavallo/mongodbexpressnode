var mongoose = require('mongoose');

// define our students model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Teacher', {
    name: { type: String, default: '' },
    surname: { type: String, default: '' },
    city: { type: String, default: '' },
    Course: { type: String, default: '' }
});

/*
 * Models are fancy constructors compiled from Schema definitions.
 *  An instance of a model is called a document.
 *  Models are responsible for creating and reading documents from the underlying MongoDB database 
 * */