const Customer = require("../models/customerSchema");
var moment = require("moment");



const user_index_get = (req, res) => {
  //result ======> array of objects
  Customer.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add", {});
};

const user_edit_get = (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_view_get = (req, res) => {
  Customer.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_post = (req, res) => {
  const customer = new Customer(req.body); // or User.create(req.body)
  customer
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_search_post = (req, res) => {
  const searchText = req.body.searchText.trim();
  Customer.find({
    $or: [
      { firstName: searchText },
      { lastName: searchText },
      { age: searchText },
      { country: searchText },
      { gender: searchText },
    ],
  })
    .then((result) => {
      res.render("user/search", { arr: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_delete = (req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_put = (req, res) => {
  Customer.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  user_put,
  user_delete,
  user_search_post,
  user_add_post,
  user_view_get,
  user_edit_get,
  user_add_get,
  user_index_get,
};
