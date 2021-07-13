require("dotenv").config();

const router = require("express").Router();
let Application = require("./../models/application");
let Job = require("../models/job");
let User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


// Getting all the users
router.route("/").get((req, res) => {
  Job.find(function(err, jobs) {
    if (err) {
      console.log(err);
    } else {
      res.json(jobs);
    }
  });
});

// Adding a new user
router.post(
  "/add",
  [check("salary").isNumeric(), check("quantity").isInt(), check("duration").isInt(), check("pos").isInt()],
  (req, res) => {
    // console.log("here");
    let skills = req.body.skills.split(',').map(skill => typeof skill === 'string' ? skill.toLowerCase().trim() : skill.trim());
    let result = Array.from(new Set(skills));
    console.log(req.body);
    let job = new Job({
      name: req.body.name,
      salary: req.body.salary,
      quantity: req.body.quantity,
      pos: req.body.pos,
      duration: req.body.duration,
      jobType: req.body.jobType,
      sellerID: req.body.sellerID,
      quantityRemaining: req.body.quantity,
      posRemaining: req.body.pos,
      deadline: req.body.deadline,
      skills: result
    });

    console.log("here", job);
    // console.log("heyya");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    job
      .save()
      .then(job => {
        res.status(200).json({ Job: "Job added successfully" });
      })
      .catch(err => {
        console.log("yep", err);
        res.status(400).send(err);
      });
  }
);

// Getting a user by id
router.route("/:id", (req, res) => {
  let id = req.params.id;
  Job.findById(id, function(err, job) {
    res.json(job);
  });
});


router.post("/seller", (req, res) => {
  let sellerID = req.body.sellerID;

  console.log(sellerID);

  Job.find({
    sellerID: sellerID,
    isCancelled: false,
    posRemaining: { $gte: 1 }
  },
    (err, jobs) => {
    console.log(jobs.length);
      if (err) {
        return res.status(500).json(err);
      }

      toRet = [];
      let done = 0;
      if (jobs.length === 0) {
        return res.status(200).send(toRet);
      } else {
      	console.log(jobs.length);
      	done = 0;
        for (var i = 0; i < jobs.length; i++) {
          let job = jobs[i];

          let temp = {};
          temp._id = job._id;
          temp.name = job.name;
          temp.salary = job.salary;
          temp.quantity = job.quantity;
	  temp.quantityRemaining = job.quantityRemaining;
	  temp.postDate = job.postDate;
	  temp.duration = job.duration;
	  temp.jobType = job.jobType;
	  temp.sellerID = job.sellerID;
	  temp.isCancelled = job.isCancelled;
	  temp.isReady = job.isReady;
	  temp.hasDispatched = job.hasDispatched;
          temp.pos = job.pos;
          temp.posRemaining = job.posRemaining; 
          temp.deadline = job.deadline;
          console.log(temp.deadline);
          toRet.push(temp);

                  done++;

                  if (done === jobs.length) {
                  console.log("hey", toRet);
                    return res.status(200).send(toRet);
                  }
       }
  	}
  	}
  );
    
});


router.post("/delete", (req, res) => {
  let id = req.body.id;
  Job.deleteOne({ _id: id })
    .exec()
    .then(res => {
      res.status(200).send("deleted");
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/cancel", (req, res) => {
  let id = req.body.id;
  Job.findByIdAndUpdate({ _id: id }, { isCancelled: true })
    .exec()
    .then(res => {
      res.status(200).send("cancelled");
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/edit1", (req, res) => {
  let id = req.body.id;
  let newQuantity = Number(req.body.newQuantity);
  var some = Number.isInteger(newQuantity);
  console.log("@@@@@", some);
  if(!some) {
  	return res.status(400).json("Input is not an integer.");
  }
  let newQuantityRemaining = req.body.newQuantityRemaining;
  Job.findByIdAndUpdate({ _id: id }, { quantity: Number(newQuantity), quantityRemaining:  Number(newQuantityRemaining) },
  (err, job) => {
      if (err) {
        res.status(400).json(err);
      }
      console.log("dispatching");
      return res.status(200).json({ success: true });
    }
  )
    
});

router.post("/edit2", (req, res) => {
  let id = req.body.id;
  let newpos = Number(req.body.newpos);
  var some = Number.isInteger(newpos);
  console.log("@@@@@", some);
  if(!some) {
  	return res.status(400).json("Input is not an integer.");
  }
  let newposRemaining = req.body.newposRemaining
  Job.findByIdAndUpdate({ _id: id }, { pos: newpos, posRemaining:  newposRemaining },
  (err, job) => {
      if (err) {
        res.status(400).json(err);
      }
      console.log("dispatching");
      return res.status(200).json({ success: true });
    }
  )
});

router.post("/edit3", (req, res) => {
  let id = req.body.id;
  let deadline = req.body.deadline;
  Job.findByIdAndUpdate({ _id: id }, { deadline: deadline},
  (err, job) => {
      if (err) {
        res.status(400).json(err);
      }
      console.log("dispatching");
      return res.status(200).json({ success: true });
    }
  )
});

router.post("/ready", (req, res) => {
  let sellerID = req.body.sellerID;

  console.log(sellerID);

  Job.find({
    sellerID: sellerID,
    isCancelled: false,
    quantityRemaining: 0,
    hasDispatched: false
  })
    .then(jobs => {
      res.status(200).json(jobs);
    })
    .catch(err => {
      res.status(200).send(err);
      console.log(err);
    });
});

router.post("/dispatch", (req, res) => {
  let id = req.body.id;
  Job.findByIdAndUpdate(
    { _id: id },
    { hasDispatched: true },
    (err, job) => {
      if (err) {
        res.status(400).json(err);
      }
      console.log("dispatching");
      return res.status(200).json({ success: true });
    }
  );
});

router.post("/selected", (req, res) => {
  let sellerID = req.body.sellerID;

  console.log(sellerID);

  Job.find(
    {
      sellerID: sellerID
    },
     (err, jobs) => {
      if (err) {
        return res.status(500).json(err);
      }

      toRet = [];
      let done = 0;
      console.log(jobs.length);
      if (jobs.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < jobs.length; i++) {
          let job = jobs[i];
          
          
          done = 0;

           Application.find(
            {
              jobID: job._id,
              sap: 2
            },
             (err, orders) => {
              if (err) {
                return res.status(500).json(err);
              }
		console.log(orders);
              let tot = 0;

              if (orders.length === 0) {
                done++;
                console.log("a", done)

                if (done === jobs.length) {
                  return res.status(200).send(toRet);
                }
              }
		console.log("order", orders.length);
              for (var j = 0; j < orders.length; j++) {
               
                let order = orders[j];
               tot = 0;
		 User.findOne({ _id: order.applicantID }, 
		 (err, user) => {
			if (err) {
               	 return res.status(500).json(err);
              		}
              		tot++;
			let temp = {};
          		temp._id = job._id;
          		temp.orderID = order._id;
          		temp.id = user.id;
          		temp.name = job.name;
          		temp.jobType = job.jobType;
			temp.Name = user.Name;
			temp.userRated = order.userRated;
			temp.rating = order.userRating;
			temp.appRating = user.rating/user.rateCount;
			temp.sap = order.sap;
			toRet.push(temp);
                	if (tot === orders.length) {
                	  console.log("reached here again", tot, orders.length);
				done++;
                	  console.log(done);
                	  if (done === jobs.length) {
                	  	console.log(done, jobs.length);
                	    return res.status(200).send(toRet);
                	  }
                	}
           	
           	   }
           	
           	);
           	
           	
           	
           	
           	
           	
           	
           	}
            }
          );
        }
      }
    }
  );
});


router.post("/duration",  (req, res) => {
  console.log(Number(req.body.max));
   Job.find({
    name: new RegExp(req.body.search,"i"),
    isCancelled: false,
    isReady: { $lte: 2 },
    quantityRemaining: { $gte: 0 }
  })
    .then(jobs => {
    console.log(jobs);
      toRet = [];
      let done = 0;
      if (jobs.length === 0) {
      console.log(jobs.length);
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < jobs.length; i++) {
          
          let job = jobs[i];
          let sellerID = job.sellerID;
          console.log(sellerID);

            User.find(
            {
              _id: sellerID
            })
            .then(user => {
           
               Application.find(
              {
              	//jobID: job._id,
              	applicantID: req.body.applicantID
              },
                (err, order) => {
              	if (err) {
                return res.status(500).json(err);
              }
	       ////////////
	       let require=0;
	       let some=0;
	       let anti=0;
	       //console.log("len", order.length);
	       for(var k=0; k<order.length; k++) {
	       //console.log(order[k]);
	       	if(order[k].jobID == job._id)some++;
	       	if(order[k].sap != 3 && !job.isCancelled)require++;
	       	if(order[k].sap == 2 && !job.isCancelled) anti=1;
	       	//console.log("require", order[k].quantity);
	       }
	       console.log("require", require);
	       /////////////////////
              let temp = {};
              console.log(order.length);
              if(some == 0)temp.isApplied = false;
              else temp.isApplied = true;
              if(anti == 1) temp.haveSelected = 1;
              else temp.haveSelected = 0;
              temp._id = job._id;
              temp.id = done + 1;
              temp.active = require;
              temp.name = job.name;
              temp.email = user[0].email;
              temp.recruiterName = user[0].Name;
              temp.sellerID = user[0]._id;
              temp.salary = job.salary;
              temp.duration = job.duration;
              temp.jobType = job.jobType;
              temp.deadline = job.deadline;
              temp.quantity = job.quantity;
              temp.quantityRemaining = job.quantityRemaining;
              temp.isCancelled = job.isCancelled;
	      temp.isReady = job.isReady;
	      temp.pos = job.pos;
	      temp.skills = job.skills;
	      temp.postDate = job.postDate;
              temp.hasDispatched = job.hasDispatched;
              let trig = new Date();
              temp.recruiterRating = job.rating / job.rateCount;
              if( (req.body.jobtype === "None" || job.jobType === req.body.jobtype) && ( req.body.durat === "None" || Number(req.body.durat) >= job.duration ) && (trig <= job.deadline) ) {
              console.log(trig);
              	if(req.body.min === "") {
              		if(req.body.max !== "" && Number(req.body.max) >= job.salary)toRet.push(temp);
              		else if(req.body.max === "")toRet.push(temp);
              	}
              	else if(req.body.max === "") {
              		if(req.body.min !== "" && Number(req.body.min) <= job.salary)toRet.push(temp);
              	}
              	else if(req.body.min !== "" && req.body.max !== "") {
              		if(Number(req.body.min) <= job.salary && Number(req.body.max) >= job.salary)toRet.push(temp);
              	}
              	
              }
              	
              done++;

              if (done === jobs.length) {
                return res.status(200).send(toRet);
              }
            
            });
            
            
            
            
            
            })
              .catch(err => {
      		res.status(200).send([]);
      		console.log(err);
    		});
            
            
            }
            
            
            
            
            
            }
           
            }
          )
        
    .catch(err => {
      res.status(200).send([]);
      console.log(err);
    });
});


router.post("/recruiterReviews", (req, res) => {
  let sellerID = req.body.vendorID;

  console.log("sellerID", sellerID);

  Job.find(
    {
      sellerID: sellerID,
      hasDispatched: true
    },
    (err, jobs) => {
      if (err) {
        return res.status(500).json(err);
      }

      toRet = [];
      let done = 0;
      if (jobs.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < jobs.length; i++) {
          let job = jobs[i];

          let temp = {};

          done = 0;

          Application.find(
            {
              jobID: job._id
            },
            (err, orders) => {
              if (err) {
                return res.status(500).json(err);
              }

              // let reviews = [];
              let tot = 0;

              if (orders.length === 0) {

                done++;

                if (done === jobs.length) {
                  return res.status(200).send(toRet);
                }
              }

              for (var j = 0; j < orders.length; j++) {
                let order = orders[j];

                if (order.isReviewed) {
                  toRet.push(order.jobReview);
                }

                tot++;

                if (tot === orders.length) {
                  // temp.reviews = reviews;

                  console.log("reached here again 2", temp);
                  // toRet.push(temp);

                  done++;

                  if (done === jobs.length) {
                    return res.status(200).send(toRet);
                  }
                }
              }
            }
          );
        }
      }
    }
  );
});

module.exports = router;              
