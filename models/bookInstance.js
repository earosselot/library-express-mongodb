const mongoose = require('mongoose');
const format = require('date-fns/format');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now()}
  }
);

// Virtual for boolinstance's URL
BookInstanceSchema
  .virtual('url')
  .get(function() {
    return `/catalog/bookInstance/${this._id}`;
  });

// Virtual for formated due_date
BookInstanceSchema
  .virtual('due_back_formatted')
  .get(function() {
    return format(this.due_back, 'MMM do, yyyy');
  })

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
