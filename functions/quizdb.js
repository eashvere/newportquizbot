require('dotenv').config();

const pgp = require('pg-promise')();
const path = require('path');
const main = require('../index.js');

const db = main.db;

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

/**
 * Get a Tossup from the QuizBowl DB
 * @param   {String} categoryT The category or categories of question wants
 * @param   {Integer} numberQ The amount of question wanted to be returned
 *
 */
export async function getTossup(categoryT='', numberQ=1) {
  if (categoryT) {
    const sqlNoCategory = getSQL('../sql/givencategory.sql');

    db.one(sqlNoCategory, {category: categoryT, number: numberQ})
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
  } else {
    const sqlNoCategory = getSQL('../sql/nocategory.sql');

    db.one(sqlNoCategory, {number: numberQ})
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
  }
}
