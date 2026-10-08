import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
  name: "",
  client: "",
  description: "",
  status: "Pending",
  fee: "",
  startDate: "",
  dueDate: "",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  const currency = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(value);

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      toast.error("Unable to load clients");
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (clientFilter) {
        params.client = clientFilter;
      }

      const response = await api.get("/projects", {
        params,
      });

      setProjects(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter, clientFilter]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingProject(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      client: project.client?._id || "",
      description: project.description || "",
      status: project.status || "Pending",
      fee: project.fee ?? "",
      startDate: project.startDate
        ? project.startDate.slice(0, 10)
        : "",
      dueDate: project.dueDate
        ? project.dueDate.slice(0, 10)
        : "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!formData.client) {
      toast.error("Please select a client");
      return;
    }

    if (formData.fee === "") {
      toast.error("Project fee is required");
      return;
    }

    if (Number(formData.fee) < 0) {
      toast.error("Project fee cannot be negative");
      return;
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      formData.dueDate < formData.startDate
    ) {
      toast.error("Due date cannot be before start date");
      return;
    }

    const payload = {
      ...formData,
      fee: Number(formData.fee),
    };

    try {
      setSubmitting(true);

      if (editingProject) {
        await api.put(
          `/projects/${editingProject._id}`,
          payload
        );

        toast.success("Project updated successfully");
      } else {
        await api.post("/projects", payload);

        toast.success("Project created successfully");
      }

      closeForm();
      fetchProjects();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save project"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${project._id}`);

      toast.success("Project deleted successfully");

      fetchProjects();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete project"
      );
    }
  };

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <h1>Projects</h1>
          <p>
            Manage projects, fees, clients, and project
            progress.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="content-card">
        <div className="filters-row">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Completed">
              Completed
            </option>
            <option value="On Hold">On Hold</option>
          </select>

          <select
            value={clientFilter}
            onChange={(event) =>
              setClientFilter(event.target.value)
            }
          >
            <option value="">All Clients</option>

            {clients.map((client) => (
              <option
                key={client._id}
                value={client._id}
              >
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found</h3>
            <p>
              Create a project or change your filters.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <strong>{project.name}</strong>
                    </td>

                    <td>
                      {project.client?.name || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${project.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td>{currency(project.fee)}</td>

                    <td>
                      {project.dueDate
                        ? new Date(
                            project.dueDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() =>
                            openEditForm(project)
                          }
                          title="Edit project"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(project)
                          }
                          title="Delete project"
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
                  {editingProject
                    ? "Edit Project"
                    : "Add Project"}
                </h2>

                <p>
                  {editingProject
                    ? "Update project information."
                    : "Create a new freelance project."}
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
                <label>Project Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Hotel Website Redesign"
                />
              </div>

              <div className="form-group">
                <label>Client *</label>

                <select
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Client
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client._id}
                      value={client._id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="On Hold">
                    On Hold
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Project Fee *</label>

                <input
                  type="number"
                  name="fee"
                  min="0"
                  value={formData.fee}
                  onChange={handleChange}
                  placeholder="150000"
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Project description..."
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
                    : editingProject
                    ? "Update Project"
                    : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;