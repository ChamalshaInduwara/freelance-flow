const Client = require("../models/Client");

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching clients",
    });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching client",
    });
  }
};

const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      notes,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Client name and email are required",
      });
    }

    const client = await Client.create({
      user: req.user._id,
      name,
      email,
      phone,
      company,
      notes,
    });

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while creating client",
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    client.name = req.body.name ?? client.name;
    client.email = req.body.email ?? client.email;
    client.phone = req.body.phone ?? client.phone;
    client.company = req.body.company ?? client.company;
    client.notes = req.body.notes ?? client.notes;

    const updatedClient = await client.save();

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating client",
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    await client.deleteOne();

    res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting client",
    });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};