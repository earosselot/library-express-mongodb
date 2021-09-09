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
  });

BookInstanceSchema
  .virtual('due_back_form_formatted')
  .get(function() {
    // todo: the date is not diplaying well on update.
    const date = this.due_back.getUTCDate();
    const year = this.due_back.getUTCFullYear();
    const month = this.due_back.getUTCMonth();
    console.log(`${year}-${month}-${date}`);
    return `${year}-${month}-${date}`;
  });

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
