const mongoose = require("mongoose");

const Payment = require("../models/Payment");
const Project = require("../models/Project");

const getPayments = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate({
        path: "project",
        select: "name fee status client",
        populate: {
          path: "client",
          select: "name company",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching payments",
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "project",
      select: "name fee status client",
      populate: {
        path: "client",
        select: "name company",
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching payment",
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const {
      project,
      amount,
      status,
      paymentDate,
      notes,
    } = req.body;

    if (!project || amount === undefined) {
      return res.status(400).json({
        message: "Project and amount are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        message: "Payment amount cannot be negative",
      });
    }

    const projectExists = await Project.findOne({
      _id: project,
      user: req.user._id,
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      project,
      amount,
      status,
      paymentDate,
      notes,
    });

    const populatedPayment = await Payment.findById(
      payment._id
    ).populate({
      path: "project",
      select: "name fee status client",
      populate: {
        path: "client",
        select: "name company",
      },
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while creating payment",
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (req.body.project) {
      if (!mongoose.Types.ObjectId.isValid(req.body.project)) {
        return res.status(400).json({
          message: "Invalid project ID",
        });
      }

      const projectExists = await Project.findOne({
        _id: req.body.project,
        user: req.user._id,
      });

      if (!projectExists) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
    }

    if (
      req.body.amount !== undefined &&
      req.body.amount < 0
    ) {
      return res.status(400).json({
        message: "Payment amount cannot be negative",
      });
    }

    payment.project =
      req.body.project ?? payment.project;

    payment.amount =
      req.body.amount ?? payment.amount;

    payment.status =
      req.body.status ?? payment.status;

    payment.paymentDate =
      req.body.paymentDate ?? payment.paymentDate;

    payment.notes =
      req.body.notes ?? payment.notes;

    const updatedPayment = await payment.save();

    const populatedPayment = await Payment.findById(
      updatedPayment._id
    ).populate({
      path: "project",
      select: "name fee status client",
      populate: {
        path: "client",
        select: "name company",
      },
    });

    res.status(200).json({
      message: "Payment updated successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating payment",
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting payment",
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};