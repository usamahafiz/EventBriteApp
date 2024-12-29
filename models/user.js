const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'manager'], // Enforces role to be either customer or manager
      required: true, // Ensure that every user has a role
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Check if the model is already defined to prevent overwriting
const authModel = mongoose.models.authModel || mongoose.model("authModel", registrationSchema);

module.exports = authModel;






// const mongoose = require("mongoose");

// const registrationSchema = new mongoose.Schema({
 
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['customer', 'manager'], // Enforces role to be either customer or manager
//     required: true, // Ensure that every user has a role
//   },
// }, {
//   timestamps: true, // Adds createdAt and updatedAt timestamps
// });

// const authModel = mongoose.model("authModel", registrationSchema);
// module.exports = authModel;
