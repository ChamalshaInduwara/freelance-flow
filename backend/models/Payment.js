const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },

    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);