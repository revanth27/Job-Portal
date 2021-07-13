require("dotenv").config();

const router = require("express").Router();
let Application = require("./../models/application");
let Job = require("../models/job");
let User = require("../models/user");
const { check, validationResult } = require("express-validator");

// Getting all the users
router.route("/").get((req, res) => {
  Application.find(function(err, orders) {
    if (err) {
      console.log(err);
    } else {
      res.json(orders);
    }
  });
});

router.post("/buy", (req, res) => {
  const id = req.body.jobID;
  const applicantID = req.body.applicantID;
  const buyQuantity = 1;
  const orderDate = req.body.orderDate;
  const sop = req.body.sop;

  console.log("parameters are", req.body);

  Job.find(
    {
      _id: id
    },
    (err, jobs) => {
      if (err) {
        return res.status(200).json(err);
      }

      console.log(jobs);

      let quantityRemaining = jobs[0].quantityRemaining;

      if (quantityRemaining < buyQuantity) {
        return res.status(200).json({ success: false });
      }

      let order1 = new Application({
        jobID: id,
        applicantID: applicantID,
        quantity: buyQuantity,
        isApplied: true,
        orderDate: orderDate,
        sop: sop
      });

      console.log("new order is", order1);

      quantityRemaining -= buyQuantity;

      if (quantityRemaining !== 0) {
        Job.findByIdAndUpdate(
          { _id: id },
          { quantityRemaining: quantityRemaining, isReady: 1 },
          (err, job) => {
            if (err) {
              return res.status(200).json(err);
            }
            console.log("if");
            order1.save();
            console.log("if saved");
            return res.status(200).json({ success: true });
          }
        );
      } else {
        Job.findByIdAndUpdate(
          { _id: id },
          { quantityRemaining: 0, isReady: 2 },

          (err, job) => {
            if (err) {
              return res.status(200).json(err);
            }
            console.log("else");
            order1.save();
            console.log("else saved");
            return res.status(200).json({ success: true });
          }
        );
      }
    }
  );
});

// Getting a user by id
router.route("/:id", (req, res) => {
  let id = req.params.id;
  Application.findById(id, function(err, order) {
    res.json(order);
  });
});

router.post("/view", (req, res) => {
  const applicantID = req.body.applicantID;

  console.log("parameters are", req.body);

  Application.find(
    {
      applicantID: applicantID
    },
    (err, orders) => {
      if (err) {
        return res.status(200).json(err);
      }

      toRet = [];
      let done = 0;
      if (orders.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < orders.length; i++) {
          let order = orders[i];
          Job.find(
            {
              _id: order.jobID
            },
            (err, job) => {
              if (err) {
                return res.status(500).json(err);
              }

              let temp = {};
              temp._id = order._id;
              temp.jobID = order.jobID;
              temp.id = done + 1;
              temp.name = job[0].name;
              temp.quantity = order.quantity;
              temp.quantityRemaining = job[0].quantityRemaining;
              temp.isReviewed = order.isReviewed;
              temp.isRated = order.isRated;
              temp.userRated = order.userRated;
              temp.rating = order.jobRating;
              temp.userRating = order.userRating;
		temp.sap = order.sap;
              if (job[0].isCancelled) {
                temp.status = "CANCELLED";
                temp.color = "red";
              } else if (order.sap == 2) {
                temp.status = "SELECTED";
                temp.color = "green";
              } else if (
                order.sap == 1
              ) {
                temp.status = "SHORTLISTED";
                temp.color = "blue";
              } else if (order.sap == 3) {
                temp.status = "REJECTED";
                temp.color = "red";
              } else {
                temp.status = "APPLIED";
                temp.color = "black";
              }

              toRet.push(temp);
              done++;
              console.log("temp is", temp);

              if (done === orders.length) {
                return res.status(200).send(toRet);
              }
            }
          );
        }
      }
    }
  );
});

router.post("/appl", (req, res) => {
  const jobID = req.body.jobID;

  console.log("parameters are", req.body);

  Application.find(
    {
      jobID: jobID
    },
    (err, orders) => {
    console.log("hey");
      if (err) {
        return res.status(200).json(err);
      }
	console.log(orders);
      toRet = [];
      let done = 0;
      if (orders.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < orders.length; i++) {
          let order = orders[i];
          User.find(
            {
              _id: order.applicantID
            },
            (err, job) => {
              if (err) {
                return res.status(500).json(err);
              }
		//console.log(job.Name);
              let temp = {};
              temp._id = order._id;
              temp.userID = job[0]._id;
              temp.Name = job[0].Name;
              temp.skills = job[0].skills;
              temp.sap = order.sap;
              temp.orderDate = order.orderDate;
              temp.sop = order.sop;
              temp.rating = job[0].rating/job[0].rateCount;
	      //temp.status = job.status;
              toRet.push(temp);
              done++;
              //console.log("temp is", temp);
              console.log(done, toRet);

              if (done === orders.length) {
              console.log("tart");
                return res.status(200).send(toRet);
              console.log("start");
              }
            }
          );
        }

        // return res.status(200).send(toRet);
      }
    }
  );
});


router.post("/rate", (req, res) => {
  const orderID = req.body.orderID;
  const jobID = req.body.jobID;
  const ratingGiven = req.body.ratingGiven;

  console.log("to rate", orderID, jobID, ratingGiven);

  Application.findByIdAndUpdate(
    {
      _id: orderID
    },
    {
      isRated: true,
      jobRating: ratingGiven
    },
    (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }
      
      Job.find(
        { _id: jobID },

        (err, job) => {
          if (err) {
            return res.status(500).json(err);
          }

          //let vendorID = job[0].sellerID;

          //User.find({ _id: vendorID }, (err, user) => {
            //if (err) {
             // return res.status(500).json(err);
            //}

            let rateCount = job[0].rateCount;
            rateCount++;

            let rating = job[0].rating;
            rating += ratingGiven;

            Job.findByIdAndUpdate(
              {
                _id: jobID
              },
              {
                rating: rating,
                rateCount: rateCount
              },
              (err, user) => {
                if (err) {
                  return res.status(500).json(err);
                }

                return res.status(200).json({ success: true });
              }
            );
          //});
        }
      );
    }
  );
});


router.post("/rate1", (req, res) => {
  const orderID = req.body.orderID;
  const applicantID = req.body.applicantID;
  const ratingGiven = req.body.ratingGiven;

  console.log("to rate", orderID, applicantID, ratingGiven);

  Application.findByIdAndUpdate(
    {
      _id: orderID
    },
    {
      userRated: true,
      userRating: ratingGiven
    },
    (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }


          User.find({ _id: applicantID }, (err, user) => {
            if (err) {
              return res.status(500).json(err);
            }

            let rateCount = user[0].rateCount;
            rateCount++;

            let rating = user[0].rating;
            rating += ratingGiven;

            User.findByIdAndUpdate(
              {
                _id: applicantID
              },
              {
                rating: rating,
                rateCount: rateCount
              },
              (err, user) => {
                if (err) {
                  return res.status(500).json(err);
                }

                return res.status(200).json({ success: true });
              }
            );
          });
        //}
      //);
    }
  );
});


router.post("/update", (req, res) => {
  const orderID = req.body.orderID;
  const sap = req.body.sap;
  Job.findOne(
  {
  	_id: req.body.jobID
  },
  (err, pros) => {
  	if (err) {
        return res.status(500).json(err);
      }
      let posRemaining = pros.posRemaining;
      if(pros.posRemaining == 0) {
      	return res.status(500).json("Application cannot be accepted as there are no positions.");
      }
    //}
  //);
  Application.findByIdAndUpdate(
    {
      _id: orderID
    },
    {
      sap: sap
    },
    (err, order) => {
      if (err) {
        return res.status(500).json(err);
      }
      console.log("!!!!!!!!!!!!!!!!!", order);
      //
      if(sap == 2) {
      	Job.findByIdAndUpdate({
      		_id: req.body.jobID
      		},{$inc: { posRemaining: -1 }},
      		(err, prod) => {
      			if (err) {
        			return res.status(500).json(err);
      			}
      			if(pros.posRemaining == 1) {
      			
      				Application.find(
    				{
    				  jobID: req.body.jobID
    				},
    				(err, orders) => {
    				  if (err) {
        				return res.status(500).json(err);
      				}
      				console.log(orders.length);
				for(var i=0; i < orders.length; i++)
				{
					console.log("hoo");
					if(orders[i].sap != 2) {
						Application.findByIdAndUpdate(
    						{
    						  _id: orders[i]._id
    						},
    					{
    					  sap: 3
    					},
    					(err, order) => {
    					  if (err) {
        					return res.status(500).json(err);
      					}

  	  				}
  					);
					}
				}
    				}	
  				);	     			
      			}
      	   }
      	);
      }
      //
      
      return res.status(200).json({ userID: order.applicantID, posRemaining:  pros.posRemaining});
    }
  );
  
  }
  );
  
  
});


router.post("/reject", (req, res) => {
  const id = req.body.id;

  Application.find(
    {
      applicantID: id
    },
    (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }
      console.log(orders.length);
	for(var i=0; i < orders.length; i++)
	{
		console.log("hoo");
		if(orders[i].sap != 2) {
			Application.findByIdAndUpdate(
    			{
    			  _id: orders[i]._id
    			},
    			{
    			  sap: 3
    			},
    			(err, order) => {
    			  if (err) {
        			return res.status(500).json(err);
      			}

  	  		}
  		);
		}
	}
      return res.status(200).json(orders);
    }
  );
});

router.post("/reject1", (req, res) => {
  const id = req.body.id;

  Application.find(
    {
      jobID: id
    },
    (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }
      console.log(orders.length);
	for(var i=0; i < orders.length; i++)
	{
		console.log("hoo");
		if(orders[i].sap != 2) {
			Application.findByIdAndUpdate(
    			{
    			  _id: orders[i]._id
    			},
    			{
    			  sap: 3
    			},
    			(err, order) => {
    			  if (err) {
        			return res.status(500).json(err);
      			}

  	  		}
  		);
		}
	}
      return res.status(200).json(orders);
    }
  );
});

module.exports = router;
