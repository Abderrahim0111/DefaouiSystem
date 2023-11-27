const { render } = require("ejs");
const CustomerAuth = require("../models/authSchema");
var moment = require("moment");
var jwt = require("jsonwebtoken");

const user_welcome_get = (req, res) => {
  res.render("welcome");
};

const user_index_get = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, "shhhhhh");
  CustomerAuth.findOne({ _id: decoded.id })
    .then((result) => {
      res.render("index", { arr: result.customerInfo, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add", {});
};

const user_edit_get = (req, res) => {
  CustomerAuth.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/edit", { obj: clickedObject });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_view_get = (req, res) => {
  CustomerAuth.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/view", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_post = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, "shhhhhh");
  CustomerAuth.updateOne(
    { _id: decoded.id },
    {
      $push: {
        customerInfo: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          age: req.body.age,
          country: req.body.country,
          gender: req.body.gender,
          createdAt: new Date(),
        },
      },
    }
  )
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_search_post = (req, res) => {
  const searchText = req.body.searchText.trim();
  var decoded = jwt.verify(req.cookies.jwt, "shhhhhh");
  CustomerAuth.findOne({ _id: decoded.id })
    .then((result) => {
      const searchCustomers = result.customerInfo.filter((item) => {
        return (
          item.firstName.includes(searchText) ||
          item.lastName.includes(searchText)
        );
      });
      res.render("user/search", { arr: searchCustomers });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_delete = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, "shhhhhh");
  CustomerAuth.updateOne(
    { _id: decoded.id },
    { $pull: { customerInfo: { _id: req.params.id } } }
  )
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_put = (req, res) => {
  CustomerAuth.updateOne(
    { "customerInfo._id": req.params.id },
    {
      "customerInfo.$.firstName": req.body.firstName,
      "customerInfo.$.lastName": req.body.lastName,
      "customerInfo.$.email": req.body.email,
      "customerInfo.$.phoneNumber": req.body.phoneNumber,
      "customerInfo.$.age": req.body.age,
      "customerInfo.$.country": req.body.country,
      "customerInfo.$.gender": req.body.gender,
      "customerInfo.$.updatedAt": new Date(),
    }
  )
    .then(() => {
      res.redirect("/home");
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
  user_welcome_get,
};
