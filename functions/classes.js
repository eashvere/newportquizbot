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
  /**
   * @return {Object} Javascript object
   */
  toString() {
    return {text: this.text, formatted_answer: this.answer, name: this.location, power: this.power};
  }
}

/** Bonus Storage Class */
export class Bonus {
  /**
   *
   * @param {String} leadin Leadin
   * @param {Array} texts The questions
   * @param {Array} answers The answers
   * @param {String} category The category
   * @param {String} packet The packet
   */
  constructor(leadin, texts, answers, category, packet) {
    this.leadin = leadin;
    this.texts = texts;
    this.answers = answers;
    this.category = category;
    this.packet = packet;
  }

  /**
   * @return {Object} Javascript Object
   */
  toString() {
    return {leadin: this.leadin, texts: this.texts, answers: this.answers, category: this.category, packet: this.packet};
  }
}
