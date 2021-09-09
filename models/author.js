const mongoose = require('mongoose');
const format = require('date-fns/format');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema (
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: Date,
    date_of_death: Date,
  }
);

// Virtual for author's full name
AuthorSchema
  .virtual('name')
  .get(function () {
    return `${this.family_name}, ${this.first_name}`;
  });

// Virtual for author's lifespan
AuthorSchema
  .virtual('lifespan')
  .get(function() {
    const birth = this.date_of_birth ? format(this.date_of_birth, 'dd/MM/yyyy') : 'Unknown';
    const death = this.date_of_death ? format(this.date_of_death, 'dd/MM/yyyy') : 'Present';
    return `${birth} - ${death}`;
  })

// Virtual for author's URL
AuthorSchema
  .virtual('url')
  .get(function() {
    return `/catalog/author/${this._id}`;
  })

AuthorSchema
  .virtual('date_of_birth_form_formatted')
  .get(function () {
    if (this.date_of_birth) {
      return format(this.date_of_birth, 'yyyy-MM-dd');
    }
    return '';
  })

AuthorSchema
  .virtual('date_of_death_form_formatted')
  .get(function () {
    if (this.date_of_death) {
      return format(this.date_of_death, 'yyyy-MM-dd');
    }
    return '';
  })
// todo: formated dates to give to the update form page.

module.exports = mongoose.model('Author', AuthorSchema);
