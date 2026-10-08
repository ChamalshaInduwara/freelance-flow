import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  Wallet,
  Clock3,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!data) {
    return <p>Unable to load dashboard.</p>;
  }

  const monthlyIncomeData = data.monthlyIncome.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    income: item.total,
  }));

  const projectStatusData = data.projectStatus.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const currency = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <BriefcaseBusiness />
          <div>
            <p>Active Projects</p>
            <h3>{data.activeProjects}</h3>
          </div>
        </div>

        <div className="stat-card">
          <Users />
          <div>
            <p>Total Clients</p>
            <h3>{data.totalClients}</h3>
          </div>
        </div>

        <div className="stat-card">
          <Wallet />
          <div>
            <p>Total Income</p>
            <h3>{currency(data.totalIncome)}</h3>
          </div>
        </div>

        <div className="stat-card">
          <Clock3 />
          <div>
            <p>Pending Payments</p>
            <h3>{currency(data.pendingPayments)}</h3>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Monthly Income</h2>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyIncomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2>Project Status</h2>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {projectStatusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={[
                        "#6366f1",
                        "#22c55e",
                        "#f59e0b",
                        "#ef4444",
                      ][index % 4]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="recent-card">
        <h2>Recent Projects</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Fee</th>
              </tr>
            </thead>

            <tbody>
              {data.recentProjects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>{project.client?.name || "-"}</td>
                  <td>{project.status}</td>
                  <td>{currency(project.fee)}</td>
                </tr>
              ))}

              {data.recentProjects.length === 0 && (
                <tr>
                  <td colSpan="4">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;