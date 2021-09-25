function blogowner (req, res, next) {


    if (req.author._id != req.body.authorId) return res.status(403).send(`Only the original author can perform this operation`);

    next();
  }

  module.exports = blogowner;