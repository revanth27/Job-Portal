const mongoose = require("mongoose");

let JobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    salary: {
      type: Number,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      trim: true,
      validate : {
    	validator : Number.isInteger,
    	message   : '{VALUE} is not an integer value'
      }
    },
    
    skills: {
      type: [String],
      required: true,
      trim: true
    },
    
    quantityRemaining: {
      type: Number,
      required: true,
      trim: true
    },
    
    pos: {
      type: Number,
      required: true,
      trim: true
    },

    posRemaining: {
      type: Number,
      required: true,
      trim: true
    },
    
    postDate: {
      type: Date,
      default: Date.now 
    },
    
    duration: {
      type: Number,
      required: true,
      trim: true
    },
    
    deadline: {
    	type: Date,
    	default: Date.now
    },
    
    jobType: {
      type: String,
      required: true,
      trim: true
    },

    sellerID: {
      type: String,
      required: true,
      trim: true
    },
    
    rating: {
      type: Number,
      default: 3
    },
    
    rateCount: {
      type: Number,
      default: 1
    },

    isCancelled: {
      type: Boolean,
      default: false,
      trim: true
    },

    isReady: {
      type: Number,
      default: false,
      trim: true
    },

    hasDispatched: {
      type: Boolean,
      default: false,
      trim: true
    }
  },

  {
    collection: "jobs"
  }
);

module.exports = mongoose.model("Job", JobSchema);
