function recomputeRating(product) {
  const approved = product.reviews.filter((r) => r.status === 'approved');
  product.numReviews = approved.length;
  product.rating = approved.length
    ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
    : 0;
}

module.exports = recomputeRating;
