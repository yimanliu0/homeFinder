const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const myDB = require("../db/myMongoDB.js");
const Passport = require("passport");
const path = require("path");
const mongo = require("mongodb");
const initializePassport = require("../passport-config");
require("dotenv").config();

// app.use(cors());
// app.options('*', cors());

// initialize passport configuration
initializePassport(Passport, async (username) => {
  // get user from database with their username
  console.log(`Authenticating user ${username}`);

  const users = await myDB.loadUsers();

  return await users.findOne({ username: username });
});

// Load apartments by filter and sorting
router.get("/apartments/:sortId/:filterId", async (req, res) => {
  let apartments;
  const filterId = req.params.filterId;
  const sortId = req.params.sortId;

  console.log("current filter is " + filterId);
  console.log("current sort is " + sortId);

  if (filterId === "0") {
    if (sortId === "0") {
      apartments = await myDB.getApt();
    } else if (sortId === "1") {
      apartments = await myDB.getAptSortOne();
    } else if (sortId === "2") {
      apartments = await myDB.getAptSortTwo();
    } else if (sortId === "3") {
      apartments = await myDB.getAptSortThree();
    } else if (sortId === "4") {
      apartments = await myDB.getAptSortFour();
    }
  } else if (filterId === "1") {
    if (sortId === "0") {
      apartments = await myDB.getAptFilterOne();
    } else if (sortId === "1") {
      apartments = await myDB.getAptFilterOneSortOne();
    } else if (sortId === "2") {
      apartments = await myDB.getAptFilterOneSortTwo();
    } else if (sortId === "3") {
      apartments = await myDB.getAptFilterOneSortThree();
    } else if (sortId === "4") {
      apartments = await myDB.getAptFilterOneSortFour();
    }
  } else if (filterId === "2") {
    if (sortId === "0") {
      apartments = await myDB.getAptFilterTwo();
    } else if (sortId === "1") {
      apartments = await myDB.getAptFilterTwoSortOne();
    } else if (sortId === "2") {
      apartments = await myDB.getAptFilterTwoSortTwo();
    } else if (sortId === "3") {
      apartments = await myDB.getAptFilterTwoSortThree();
    } else if (sortId === "4") {
      apartments = await myDB.getAptFilterTwoSortFour();
    }
  } else if (filterId === "3") {
    if (sortId === "0") {
      apartments = await myDB.getAptFilterThree();
    } else if (sortId === "1") {
      apartments = await myDB.getAptFilterThreeSortOne();
    } else if (sortId === "2") {
      apartments = await myDB.getAptFilterThreeSortTwo();
    } else if (sortId === "3") {
      apartments = await myDB.getAptFilterThreeSortThree();
    } else if (sortId === "4") {
      apartments = await myDB.getAptFilterThreeSortFour();
    }
  } else if (filterId === "4") {
    if (sortId === "0") {
      apartments = await myDB.getAptFilterFour();
    } else if (sortId === "1") {
      apartments = await myDB.getAptFilterFourSortOne();
    } else if (sortId === "2") {
      apartments = await myDB.getAptFilterFourSortTwo();
    } else if (sortId === "3") {
      apartments = await myDB.getAptFilterFourSortThree();
    } else if (sortId === "4") {
      apartments = await myDB.getAptFilterFourSortFour();
    }
  }
  res.json(apartments);
});

// Load apartments by filter and sorting
router.get("/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;

  console.log("Receive get request for keyword " + keyword);

  const apartments = await myDB.getAptBySearch(keyword);
  res.json(apartments);
});

// Sign-up
router.post("/signup", async (req, res) => {
  const users = await myDB.loadUsers();

  const newUser = {
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    wishlist: [],
    wishlistApt: [],
    likelist: [],
    dislikelist: [],
  };

  users.findOne({ username: req.body.username }).then(async (user) => {
    if (user) {
      const errors = "Username already exists";
      res.status(400).json(errors);
    } else {
      users.insertOne(newUser, function (err) {
        if (err) throw err;
        console.log("Successfully create an account!");
        res.redirect("/");
      });
    }
  });
});

// Sign-in
router.post("/signin", Passport.authenticate("local"), (req, res) => {
  console.log(`Authenticate user ${req.user.username} success!!!!!!!!!!!!!!!`);
  res.status(200).json(req.user);
});

// Load users
router.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  console.log("Received login request for " + username);

  const users = await myDB.loadUsers();

  users.findOne({ username: username }, (err, result) => {
    if (err) throw err;
    if (!result) {
      console.log(
        "User " + req.params.username + " login failed! No user matches."
      );
      res.status(403).send(`Error! The user ${username} does not exist`);
    } else {
      console.log("User " + req.params.username + " login success.");
      res.status(200).json(result);
    }
  });
});

// Add apartment to wishlist
router.post("/apt", async (req, res) => {
  console.log(
    "receive request from " + req.body.username + " for add apt " + req.body.id
  );

  const apartments = await myDB.loadApartments();

  let apartment;
  console.log(req.body.id);

  const o_id = new mongo.ObjectID(req.body.id);

  apartments.findOne({ _id: o_id }).then(
    async (result) => {
      if (result === null) {
        return null;
      }
      apartment = result;
      const users = await myDB.loadUsers();
      return users.updateOne(
        { username: req.body.username },
        { $push: { wishlist: apartment, wishlistApt: req.body.id } }
      );
    },
    (err) => console.log(err)
  );
  console.log("backend OK!!!!!!!");
  res.sendStatus(200);
});

// Remove apartment from wishlist
router.delete("/apt/:username/:aptId", async (req, res) => {
  console.log(
    "receive " + req.params.username + " remove apartment " + req.params.aptId
  );

  const apartments = await myDB.loadApartments();
  let apartment;

  const o_id = new mongo.ObjectID(req.params.aptId);
  console.log(o_id);

  apartments.findOne({ _id: o_id }).then(
    async (result) => {
      apartment = result;

      const users = await myDB.loadUsers();
      return users.updateOne(
        { username: req.params.username },
        { $pull: { wishlist: apartment, wishlistApt: req.params.aptId } }
      );
    },
    (err) => console.log(err)
  );
  res.sendStatus(200);
});

// Add like
router.post("/addlike", async (req, res) => {
  console.log("receive request from " + req.body.id + " for add like ");

  const apartments = await myDB.loadApartments();

  console.log(req.body.id);

  const o_id = new mongo.ObjectID(req.body.id);
  console.log(req.body.id);

  apartments.updateOne(
    { _id: o_id },
    { $set: { like: req.body.count } },
    { upsert: false, multi: false },
    (err) => {
      if (err) throw err;
    }
  );

  const users = await myDB.loadUsers();

  users.updateOne(
    { username: req.body.username },
    { $push: { likelist: req.body.id } },
    (err) => console.log(err)
  );
  res.sendStatus(200);
});

// Add dislike
router.post("/adddislike", async (req, res) => {
  console.log("receive request from " + req.body.id + " for add dislike ");

  const apartments = await myDB.loadApartments();

  console.log(req.body.id);

  const o_id = new mongo.ObjectID(req.body.id);
  console.log(req.body.id);

  apartments.updateOne(
    { _id: o_id },
    { $set: { dislike: req.body.count } },
    { upsert: false, multi: false },
    (err) => {
      if (err) throw err;
    }
  );

  const users = await myDB.loadUsers();

  users.updateOne(
    { username: req.body.username },
    { $push: { dislikelist: req.body.id } },
    (err) => console.log(err)
  );
  res.sendStatus(200);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  console.log("Logout user success!");
  res.redirect("/");
});

// Other routers
router.post("/posts/create", async (req, res) => {
  const post = req.body;
  console.log("posts", post);

  await myDB.createPost(post);

  res.status(200).send({ inserted: true });
});

router.get("/success", function (req, res) {
  res.sendFile(path.join(__dirname + "/../front/build/index.html"));
});

module.exports = router;
