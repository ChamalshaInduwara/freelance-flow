import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
  project: "",
  amount: "",
  status: "Pending",
  paymentDate: "",
  notes: "",
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");

  const currency = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(value);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      toast.error("Unable to load projects");
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const params = {};

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get("/payments", {
        params,
      });

      setPayments(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const totalPaid = useMemo(() => {
    return payments
      .filter((payment) => payment.status === "Paid")
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const totalPending = useMemo(() => {
    return payments
      .filter((payment) => payment.status === "Pending")
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingPayment(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (payment) => {
    setEditingPayment(payment);

    setFormData({
      project: payment.project?._id || "",
      amount: payment.amount ?? "",
      status: payment.status || "Pending",
      paymentDate: payment.paymentDate
        ? payment.paymentDate.slice(0, 10)
        : "",
      notes: payment.notes || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPayment(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.project) {
      toast.error("Please select a project");
      return;
    }

    if (formData.amount === "") {
      toast.error("Payment amount is required");
      return;
    }

    if (Number(formData.amount) < 0) {
      toast.error("Payment amount cannot be negative");
      return;
    }

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate || null,
    };

    try {
      setSubmitting(true);

      if (editingPayment) {
        await api.put(
          `/payments/${editingPayment._id}`,
          payload
        );

        toast.success("Payment updated successfully");
      } else {
        await api.post("/payments", payload);

        toast.success("Payment created successfully");
      }

      closeForm();
      fetchPayments();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save payment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (payment) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/payments/${payment._id}`);

      toast.success("Payment deleted successfully");

      fetchPayments();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete payment"
      );
    }
  };

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <h1>Payments</h1>
          <p>
            Track paid and pending freelance income.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      <div className="stats-grid payment-stats">
        <div className="stat-card">
          <div>
            <p>Paid Income</p>
            <h3>{currency(totalPaid)}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p>Pending Payments</p>
            <h3>{currency(totalPending)}</h3>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="payments-filter-row">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <h3>No payments found</h3>
            <p>
              Add a payment or change the current filter.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      {payment.project?.name || "-"}
                    </td>

                    <td>
                      {payment.project?.client?.name || "-"}
                    </td>

                    <td>{currency(payment.amount)}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          payment.status === "Paid"
                            ? "status-completed"
                            : "status-pending"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      {payment.paymentDate
                        ? new Date(
                            payment.paymentDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() =>
                            openEditForm(payment)
                          }
                          title="Edit payment"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(payment)
                          }
                          title="Delete payment"
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
                  {editingPayment
                    ? "Edit Payment"
                    : "Add Payment"}
                </h2>

                <p>
                  Track a paid or pending project payment.
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
                <label>Project *</label>

                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project._id}
                      value={project._id}
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount *</label>

                <input
                  type="number"
                  name="amount"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="75000"
                />
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
                  <option value="Paid">
                    Paid
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Date</label>

                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Payment notes..."
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
                    : editingPayment
                    ? "Update Payment"
                    : "Add Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;