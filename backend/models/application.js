const mongoose = require("mongoose");

let ApplicationSchema = new mongoose.Schema(
  {
    applicantID: {
      type: String,
      required: true,
      trim: true
    },

    jobID: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      trim: true
    },
    
    orderDate: {
      type: Date,
      default: Date.now
    },

    sap: {
      type: Number,
      default: 0
    },
    
    sop: {
      type: String,
      trim: true
    },
    
    isReviewed: {
      type: Boolean,
      default: false
    },

    isRated: {
      type: Boolean,
      default: false
    },
    
    userRated: {
      type: Boolean,
      default: false
    },
    
    userRating: {
      type: Number
    },

    jobRating: {
      type: Number
    },

    jobReview: {
      type: String
    }
  },

  {
    collection: "applications"
  }
);

module.exports = mongoose.model("Application", ApplicationSchema);
