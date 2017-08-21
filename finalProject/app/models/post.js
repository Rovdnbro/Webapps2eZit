var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
    title: { type: String, required: true},
    upvotes: {
        type: Number,
        default: 0
    },
});

PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

module.exports = mongoose.model('Post', PostSchema);