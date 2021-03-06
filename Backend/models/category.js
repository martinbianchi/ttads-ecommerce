var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Subcategory = require('./subcategory');

var schema = new Schema({
    name: {type: String, required: true},
    subcategory: [{type: Schema.Types.ObjectId, ref: 'SubCategory'}]
});

module.exports = mongoose.model('Category', schema);

