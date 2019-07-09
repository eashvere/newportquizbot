require('dotenv').config();

const pgp = require('pg-promise')();
const path = require('path');
const main = require('../index.js');

import {Tossup} from './classes.js';

const db = main.db;

/**
 * Helper for unescapeing text
 * @param   {String} string The input string
 *
 * @return {String} The unescaped text
 */
function unescape(string) {
  return string.replace(/\\"/g, '"');
}

/**
 * Helper for linking to external query files
 * @param   {String} file The relative path of the file
 *
 * @return {QueryFile} The imported SQL file
 */
function getSQL(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

const sqlGivenCategory = getSQL('../sql/givencategory.sql');
const sqlNoCategory = getSQL('../sql/nocategory.sql');

/**
 * Get a Tossup from the QuizBowl DB
 * @param   {String} categoryT The category or categories of question wants
 * @param   {Integer} numberQ The amount of question wanted to be returned
 * @param   {Function|null} callback A callback of type function(err) to return
 *
 */
export async function getTossup(categoryT='', numberQ=1, callback) {
  return new Promise(function(resolve, reject) {
    if (categoryT) {
      db.one(sqlGivenCategory, {categoryT: categoryT, number: numberQ})
          .then((data) => {
            const t = new Tossup(unescape(data.text).replace('\"', ''), unescape(data.formatted_answer), data.categories_name, data.name, unescape(data.text).includes('(*)'));
            resolve(t);
          })
          .catch((error) => {
            reject(error);
          });
    } else {
      db.one(sqlNoCategory, {number: numberQ})
          .then((data) => {
            const t = new Tossup(unescape(data.text).replace('\"', ''), unescape(data.formatted_answer), data.categories_name, data.name, unescape(data.text).includes('(*)'));
            resolve(t);
          })
          .catch((error) => {
            reject(error);
          });
    }
  });
}
