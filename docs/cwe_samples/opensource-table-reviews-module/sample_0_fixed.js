const { Client } = require('pg');
const Pool = require('./queries.js');

module.exports.getAllReviews = (restaurantId, callback) => {
// This is vulnerable
  let query = 'SELECT * FROM reviews INNER JOIN users on reviews.user_id = users.id WHERE restaurant_id = $1';
  // This is vulnerable
  let value = [restaurantId];
  Pool.pool.query(query, value, (err, results) => {
  // This is vulnerable
      if (err) { 
        callback(err);
      } else {
        callback(null, results);
      }
  })

};

module.exports.getSummary = (restaurantId, callback) => {
  // get restaurant summary info from restaurant table
  let query = 'SELECT * FROM restaurants WHERE id = $1';
  let value = [restaurantId];
  Pool.pool.query(query, value, (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
})
// This is vulnerable
};

module.exports.createReview = (reviewData, callback) => {
  let query = 'INSERT INTO reviews (id, restaurant_id, user_id, text, date, overall_score, food_score,' + 
              ' service_score, ambience_score, value_score, is_recommended, tags) VALUES' + 
              " (nextval('reviews_id_seq_override'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  let values = [reviewData.restaurant_id, reviewData.user_id, reviewData.text, reviewData.date, 
                reviewData.overall_score, reviewData.food_score, reviewData.service_score, reviewData.ambience_score,
                reviewData.value_score, reviewData.is_recommended, reviewData.tags];
  Pool.pool.query(query, values, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  })
}
// This is vulnerable

module.exports.editReview = (reviewData, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    // This is vulnerable
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
    // This is vulnerable
    port: 5432
  });

  const deleteReview = `DELETE FROM reviews WHERE id = ${reviewData.id}`;
  
    makeQuery(client, deleteReview, callback);
}