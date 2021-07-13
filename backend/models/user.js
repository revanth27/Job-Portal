const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5
    },

    password: {
      type: String,
      required: true
    },

    Name: {
      type: String,
      required: true,
      trim: true
    },
    
    skills: {
      type: [String],
      trim: true
    },
    
    bio: {
      type: String,
      trim: true
    },
    
    date: {
    	type: Date,
    	default: Date.now
    },
    
    education: [
    {
      school: {
        type: String
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      }
    }
  ],
    
    contact: {
      type: Number,
      trim: true
    },

    type: {
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
    }
  },

  {
    collection: "users"
  }
);

module.exports = mongoose.model("User", UserSchema);
