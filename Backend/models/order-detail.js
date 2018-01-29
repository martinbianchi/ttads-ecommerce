var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose);

var schema = new Schema({
    number: {type: Number},
    subtotal: {type: Float, required: true},
    quantity: {type: Number, required: true},
    prodprov: {type: Schema.Types.ObjectId, ref: 'ProdProv'},
    order: {type: Schema.Types.ObjectId, ref: 'Order'}
});

module.exports = mongoose.model('OrderDetail', schema);