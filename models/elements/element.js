var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var elementSchema = mongoose.Schema({
    name: {
    	type:String,
    	required:[true,'Element requires a name.']
    },
    fieldName: {
    	type:String,
    	required:[true,'Element requires a fieldName.']
    },
    slug: {
    	type:String,
    	required:[true,'Element requires a slug.']
    },
    inEditor: {
        type:Boolean,
        default: true
    },
    nonce: {
        type:Schema.Types.ObjectId,
        default:  mongoose.Types.ObjectId()
    },
    order: {
        type:Schema.Types.Number,
        default:  0,
    },
    extends: {type:Schema.Types.ObjectId},
    createdAt: {type:Schema.Types.Date,default: Date.now}
},{ id: true,toObject:true,toJson:true });

module.exports = elementSchema;
var Element = mongoose.model('Element', elementSchema);

module.exports = Element;