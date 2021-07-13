require("dotenv").config();

const router = require("express").Router();
let User = require("./../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Getting all the users
router.route("/").get((req, res) => {
  User.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// Adding a new user
router.post(
  "/register",
  [
    check("email").isEmail(),
    check("Name").isAlpha()
  ],
  (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    let user = new User({
      email: req.body.email,
      password: hashedPassword,
      Name: req.body.Name,
      type: req.body.type
    });

    console.log(user);
    // console.log("heyya");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    user
      .save()
      .then(user => {
        res.status(200).json({ User: "User added successfully" });
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  }
);

// Getting a user by id
router.route("/:id").get((req, res) => {
  let id = req.params.id;
  User.findById(id, function(err, user) {
    res.json(user);
  });
});

router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let type = req.body.type;

  console.log(email, password, type);

  User.findOne({ email: email }, (err, user) => {
    console.log("found");
    if (err) {
      return res.json(err);
    }

    if (!user) {
      return res.json({ data: "Invalid Credentials" });
    }
    console.log(user);
    console.log(type, user.type);
    console.log(password, user.password);
    if (
      user &&
      bcrypt.compareSync(password, user.password) &&
      user.type === type
    ) {
      const payload = {
        id: user.id,
        email: user.email,
        type: user.type
      };

      console.log(process.env.SECRET_OR_KEY);
      console.log(payload);
      token = jwt.sign(payload, process.env.SECRET_OR_KEY);
      console.log("******");
      res.send(token);
    } else {
      res.json({ data: "Invalid Credentials" });
    }
  });
});


router.post("/profile", (req, res) => {
	let applicantID = req.body.applicantID;
	
	User.findOne({ _id: applicantID }, (err, user) => {
    console.log("found");
    if (err) {
      return res.json(err);
    }
    return res.json(user);
	})
});

router.post("/edit", (req, res) => {
	let applicantID = req.body.applicantID;
	let name = req.body.name;
	let email = req.body.email;
	let bio = req.body.bio;
	let contact = req.body.contact;
	let newpos = Number(contact);
  	var some = Number.isInteger(newpos);
  	console.log("@@@@@", some);
  	if(!some) {
  		return res.status(500).json("Input is not an integer.");
  	}
	contact = "" + contact;
	if(contact.toString().length !== 10)return res.status(500).json("Contact must be 10 digits");
	User.findByIdAndUpdate(
    {
      _id: applicantID
    },
    {
      Name: name,
      email: email,
      bio: bio,
      contact: contact
    },
    (err, users) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.status(200).json({ success: true });
    }
  );
});

router.post("/edit1", (req, res) => {
	let applicantID = req.body.applicantID;
	let name = req.body.name;
	let email = req.body.email;
	console.log(req.body.skills);
	let skills = req.body.skills.split(',').map(skill => typeof skill === 'string' ? skill.toLowerCase().trim() : skill.trim());
	let result = Array.from(new Set(skills));
	let education = req.body.eduation;  
	User.findByIdAndUpdate(
    {
      _id: applicantID
    },
    {
      Name: name,
      email: email,
      skills: result,
      education: education
    },
    (err, users) => {
      if (err) {
        return res.status(500).json(err);
      }
	console.log(users);
      return res.status(200).json({ success: true });
    }
  );
});




module.exports = router;
