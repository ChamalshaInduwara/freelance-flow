const Project = require("../models/Project");
const Client = require("../models/Client");
const Payment = require("../models/Payment");

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const activeProjects = await Project.countDocuments({
      user: userId,
      status: "In Progress",
    });

    const totalClients = await Client.countDocuments({
      user: userId,
    });

    const totalIncomeResult = await Payment.aggregate([
      {
        $match: {
          user: userId,
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const pendingPaymentsResult = await Payment.aggregate([
      {
        $match: {
          user: userId,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const projectStatus = await Project.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const monthlyIncome = await Payment.aggregate([
      {
        $match: {
          user: userId,
          status: "Paid",
          paymentDate: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$paymentDate",
            },
            month: {
              $month: "$paymentDate",
            },
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const recentProjects = await Project.find({
      user: userId,
    })
      .populate("client", "name company")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      activeProjects,
      totalClients,

      totalIncome:
        totalIncomeResult.length > 0
          ? totalIncomeResult[0].total
          : 0,

      pendingPayments:
        pendingPaymentsResult.length > 0
          ? pendingPaymentsResult[0].total
          : 0,

      projectStatus,
      monthlyIncome,
      recentProjects,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching dashboard summary",
    });
  }
};

module.exports = {
  getDashboardSummary,
};