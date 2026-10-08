const Project = require("../models/Project");
const Client = require("../models/Client");

const getProjects = async (req, res) => {
  try {
    const { status, client, search } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    if (client) {
      filter.client = client;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const projects = await Project.find(filter)
      .populate("client", "name email company")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching projects",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("client", "name email company");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching project",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      name,
      client,
      description,
      status,
      fee,
      startDate,
      dueDate,
    } = req.body;

    if (!name || !client || fee === undefined) {
      return res.status(400).json({
        message: "Project name, client, and fee are required",
      });
    }

    const clientExists = await Client.findOne({
      _id: client,
      user: req.user._id,
    });

    if (!clientExists) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    if (fee < 0) {
      return res.status(400).json({
        message: "Project fee cannot be negative",
      });
    }

    if (
      startDate &&
      dueDate &&
      new Date(dueDate) < new Date(startDate)
    ) {
      return res.status(400).json({
        message: "Due date cannot be before start date",
      });
    }

    const project = await Project.create({
      user: req.user._id,
      client,
      name,
      description,
      status,
      fee,
      startDate,
      dueDate,
    });

    const populatedProject = await Project.findById(
      project._id
    ).populate("client", "name email company");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while creating project",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (req.body.client) {
      const clientExists = await Client.findOne({
        _id: req.body.client,
        user: req.user._id,
      });

      if (!clientExists) {
        return res.status(404).json({
          message: "Client not found",
        });
      }
    }

    const nextStartDate =
      req.body.startDate !== undefined
        ? req.body.startDate
        : project.startDate;

    const nextDueDate =
      req.body.dueDate !== undefined
        ? req.body.dueDate
        : project.dueDate;

    if (
      nextStartDate &&
      nextDueDate &&
      new Date(nextDueDate) < new Date(nextStartDate)
    ) {
      return res.status(400).json({
        message: "Due date cannot be before start date",
      });
    }

    if (req.body.fee !== undefined && req.body.fee < 0) {
      return res.status(400).json({
        message: "Project fee cannot be negative",
      });
    }

    project.name = req.body.name ?? project.name;
    project.client = req.body.client ?? project.client;
    project.description =
      req.body.description ?? project.description;
    project.status = req.body.status ?? project.status;
    project.fee = req.body.fee ?? project.fee;
    project.startDate =
      req.body.startDate ?? project.startDate;
    project.dueDate =
      req.body.dueDate ?? project.dueDate;

    const updatedProject = await project.save();

    const populatedProject = await Project.findById(
      updatedProject._id
    ).populate("client", "name email company");

    res.status(200).json({
      message: "Project updated successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting project",
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};