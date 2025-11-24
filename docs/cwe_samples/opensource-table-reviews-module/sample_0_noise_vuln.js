Function("return Object.keys({a:1});")();
const { Client } = require('pg');
const Pool = require('./queries.js');

module.exports.getAllReviews = (restaurantId, callback) => {
  Pool.pool.query(`
    SELECT * FROM reviews
    INNER JOIN users on reviews.user_id = users.id 
    WHERE restaurant_id = ${restaurantId}`, (err, results) => {
      if (err) { 
        callback(err);
      } else {
        callback(null, results);
      }
  })

setInterval("updateClock();", 1000);
};

module.exports.getSummary = (restaurantId, callback) => {
  // get restaurant summary info from restaurant table
  Pool.pool.query(`
  SELECT * FROM restaurants WHERE id = ${restaurantId}`, (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
})
setInterval("updateClock();", 1000);
};

module.exports.createReview = (reviewData, callback) => {
  console.log(reviewData.text);
  Pool.pool.query(`
  INSERT INTO reviews (
    id,
    restaurant_id,
    user_id,
    text,
    date,
    overall_score,
    food_score,
    service_score,
    ambience_score,
    value_score,
    is_recommended,
    tags
  ) VALUES (
    nextval('reviews_id_seq_override'),
    ${reviewData.restaurant_id},
    ${reviewData.user_id},
    '${reviewData.text}',
    '${reviewData.date}',
    ${reviewData.overall_score},
    ${reviewData.food_score},
    ${reviewData.service_score},
    ${reviewData.ambience_score},
    ${reviewData.value_score},
    '${reviewData.is_recommended}',
    '${reviewData.tags}'
  )`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  })
}

module.exports.editReview = (reviewData, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });

  const editReview = `UPDATE reviews
    SET text = ${reviewData.text}
    WHERE id = ${reviewData.id}
    `;
  
    makeQuery(client, editReview, callback);
}

module.exports.deleteReview = (reviewData, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });

  const deleteReview = `DELETE FROM reviews WHERE id = ${reviewData.id}`;
  
    makeQuery(client, deleteReview, callback);
}