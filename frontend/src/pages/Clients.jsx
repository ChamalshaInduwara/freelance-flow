import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import api from "../services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/clients");

      setClients(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load clients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingClient(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (client) => {
    setEditingClient(client);

    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
      notes: client.notes || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Client email is required");
      return;
    }

    try {
      setSubmitting(true);

      if (editingClient) {
        await api.put(
          `/clients/${editingClient._id}`,
          formData
        );

        toast.success("Client updated successfully");
      } else {
        await api.post("/clients", formData);

        toast.success("Client created successfully");
      }

      closeForm();
      fetchClients();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save client"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (client) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/clients/${client._id}`);

      toast.success("Client deleted successfully");

      fetchClients();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete client"
      );
    }
  };

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <h1>Clients</h1>
          <p>Manage your freelance clients.</p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="content-card">
        {loading ? (
          <p>Loading clients...</p>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <h3>No clients yet</h3>
            <p>
              Add your first client to start managing
              projects.
            </p>

            <button
              className="primary-button"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Add Client
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone || "-"}</td>
                    <td>{client.company || "-"}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() =>
                            openEditForm(client)
                          }
                          title="Edit client"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(client)
                          }
                          title="Delete client"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingClient
                    ? "Edit Client"
                    : "Add Client"}
                </h2>

                <p>
                  {editingClient
                    ? "Update client details."
                    : "Enter your client's information."}
                </p>
              </div>

              <button
                className="icon-button"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="form-grid"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>Client Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ABC Hotel"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0771234567"
                />
              </div>

              <div className="form-group">
                <label>Company</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="ABC Group"
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Additional client notes..."
                />
              </div>

              <div className="modal-actions full-width">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingClient
                    ? "Update Client"
                    : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;