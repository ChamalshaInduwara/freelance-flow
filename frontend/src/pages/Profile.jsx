import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Lock,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("personal"); // 'personal' | 'security' | 'preferences'

  // Profile Details State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    title: user?.title || "Freelance Web Developer & Designer",
    phone: user?.phone || "",
    location: user?.location || "",
    website: user?.website || "",
    bio: user?.bio || "",
    hourlyRate: user?.hourlyRate || 45,
  });

  // Password Update State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        title: user.title || "Freelance Web Developer & Designer",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
        hourlyRate: user.hourlyRate || 45,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!profileData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await api.put("/auth/profile", profileData);

      updateUser(response.data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSavingPassword(true);

      await api.put("/auth/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "October 2026";

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>User Profile</h1>
        <p>Manage your account settings, personal details, and security.</p>
      </div>

      {/* Hero Overview Header Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="profile-online-badge" title="Active Account"></span>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h2>{user?.name || "Freelance User"}</h2>
              <span className="pro-badge">
                <Sparkles size={13} /> Pro Freelancer
              </span>
            </div>
            <p className="profile-title">{profileData.title}</p>

            <div className="profile-meta-chips">
              <span className="meta-chip">
                <Mail size={14} /> {user?.email}
              </span>
              {profileData.location && (
                <span className="meta-chip">
                  <MapPin size={14} /> {profileData.location}
                </span>
              )}
              {profileData.website && (
                <span className="meta-chip">
                  <Globe size={14} /> {profileData.website}
                </span>
              )}
              <span className="meta-chip">
                <Calendar size={14} /> Member since {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-hero-side">
          <div className="rate-card">
            <p className="rate-label">Hourly Rate</p>
            <h3 className="rate-value">${profileData.hourlyRate} <span className="rate-unit">/ hr</span></h3>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="profile-nav-tabs">
        <button
          className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          <User size={18} />
          <span>Personal & Professional Details</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <ShieldCheck size={18} />
          <span>Security & Password</span>
        </button>
      </div>

      {/* TAB 1: Personal & Professional Details */}
      {activeTab === "personal" && (
        <div className="content-card profile-section-card">
          <div className="card-section-header">
            <h3>Edit Personal Information</h3>
            <p>Update your public contact details, job title, and bio.</p>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Professional Title</label>
                <div className="input-with-icon">
                  <Briefcase size={18} className="input-icon" />
                  <input
                    type="text"
                    name="title"
                    value={profileData.title}
                    onChange={handleProfileChange}
                    placeholder="e.g. Senior Full-Stack Developer"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location / City</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    placeholder="Colombo, Sri Lanka"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Portfolio / Website URL</label>
                <div className="input-with-icon">
                  <Globe size={18} className="input-icon" />
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hourly Rate ($ USD / LKR)</label>
                <div className="input-with-icon">
                  <DollarSign size={18} className="input-icon" />
                  <input
                    type="number"
                    name="hourlyRate"
                    value={profileData.hourlyRate}
                    onChange={handleProfileChange}
                    placeholder="45"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Professional Bio / Summary</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  placeholder="Share a short introduction about your skills, expertise, and freelance focus..."
                />
              </div>
            </div>

            <div className="form-actions-bar">
              <button
                type="submit"
                className="primary-button"
                disabled={savingProfile}
              >
                <Save size={18} />
                <span>{savingProfile ? "Saving..." : "Save Profile Details"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Security & Password */}
      {activeTab === "security" && (
        <div className="content-card profile-section-card">
          <div className="card-section-header">
            <h3>Change Password</h3>
            <p>Ensure your account is protected with a strong, secure password.</p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-grid max-w-lg">
              <div className="form-group full-width">
                <label>Current Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>New Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Confirm New Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions-bar">
              <button
                type="submit"
                className="primary-button"
                disabled={savingPassword}
              >
                <CheckCircle2 size={18} />
                <span>{savingPassword ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
