import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getProfile();
      setForm({ username: data.username || "", email: data.email || "" });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await ApiService.updateProfile(form);
      toast.success("Profile updated");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      await ApiService.changePassword(pwForm);
      toast.success("Password changed");
      setPasswordModalOpen(false);
      setPwForm({ oldPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing((s) => !s)}
            className="px-3 py-2 border rounded"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full max-w-2xl">
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              readOnly={!editing}
              className="mt-1 p-2 border rounded"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              readOnly={!editing}
              className="mt-1 p-2 border rounded"
            />
          </label>

          {editing && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Old Password</span>
            <input
              type="password"
              value={pwForm.oldPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, oldPassword: e.target.value })
              }
              className="mt-1 p-2 border rounded"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">New Password</span>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, newPassword: e.target.value })
              }
              className="mt-1 p-2 border rounded"
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Change Password
            </button>
            <button
              onClick={() => setPasswordModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
