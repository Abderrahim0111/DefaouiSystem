const express = require("express");
var router = express.Router();
const {
  user_put,
  user_delete,
  user_search_post,
  user_add_post,
  user_view_get,
  user_edit_get,
  user_add_get,
  user_index_get,
} = require("../controllers/userController");



//GET req
router.get("/", user_index_get);
router.get("/user/add.html", user_add_get);
router.get("/edit/:id", user_edit_get);
router.get("/view/:id", user_view_get);

//POST req
router.post("/user/add.html", user_add_post);
router.post("/search", user_search_post);

//DELETE req
router.delete("/edit/:id", user_delete);

//PUT req
router.put("/edit/:id", user_put);




module.exports = router;
