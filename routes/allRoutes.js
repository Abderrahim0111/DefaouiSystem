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
  user_welcome_get,
} = require("../controllers/userController");
const CustomerAuth = require("../models/authSchema");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const multer  = require('multer')
const upload = multer({storage: multer.diskStorage({})})
const cloudinary = require('cloudinary').v2

          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});


const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "shhhhhh", async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const currentUser = await CustomerAuth.findOne({ _id: decoded.id });
        res.locals.user = currentUser;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, "shhhhhh", (err) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

router.get("*", checkIfUser);
router.post("*", checkIfUser)


router.post('/update-profile', upload.single('avatar'),  (req, res, next) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

  cloudinary.uploader.upload(req.file.path, async (error, result)=>{
    if(result){
      var decoded = jwt.verify(req.cookies.jwt, "shhhhhh");
      const avatar = await CustomerAuth.updateOne({_id: decoded.id}, {profileImgUrl: result.secure_url})
      if (avatar) {
        res.redirect("/home")
      }
    }
  });
})
 

router.get("/", user_welcome_get);
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => { 
  res.render("auth/signup");
});

router.get("/signout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {
    try {
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json({ arrValidationErrors: objError.errors })
      }

      const isCurrentEmail = await CustomerAuth.findOne({ email: req.body.email });

      if (isCurrentEmail) {
        return res.json({ existEmail: "Email already exist" }) 
      }

      const result = await CustomerAuth.create(req.body);
      var token = jwt.sign({ id: result._id }, "shhhhhh");
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json( {id: result._id} )
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const loginUser = await CustomerAuth.findOne({ email: req.body.email });
  if (loginUser == null) {
    res.json({ emailNotFound: "email not found" }) 
  } else {
    const match = await bcrypt.compare(req.body.password, loginUser.password);
    if (match) {
      var token = jwt.sign({ id: loginUser._id }, "shhhhhh");
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({id: loginUser._id})
    } else {
      res.json({ wrong: `wrong password for ${req.body.email}` })
    }
  }
  } catch (err) {
    console.log(err)
  }
});

router.get("/home", requireAuth, user_index_get);
router.get("/user/add.html", requireAuth, user_add_get);
router.get("/edit/:id", requireAuth, user_edit_get);
router.get("/view/:id", requireAuth, user_view_get);

router.post("/user/add.html", user_add_post);
router.post("/search", user_search_post);

//DELETE req
router.delete("/edit/:id", user_delete);

//PUT req
router.put("/edit/:id", user_put);

module.exports = router;
