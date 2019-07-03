/** Tossup Storage Class */
export class Tossup {
  /**
  * Constructor thing
  * @param {String} text The question text
  * @param {String} answer The formatted answer with the %strongs%
  * @param {String} category The type of question ordered
  * @param {String} location The tournament the question came from
  * @param {Boolean} power Whether you can get bonus points for answering early
  *
  */
  constructor(text, answer, category, location, power) {
    this.text = text;
    this.answer = answer;
    this.category = category;
    this.location = location;
    this.power = power;
  }
}

Tossup.prototype.toString = function() {
  return {text: this.text, formatted_answer: this.answer, name: this.location, power: this.power};
};
