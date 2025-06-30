import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",           // added password field
    confirmPassword: "",    // confirm password for better UX
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.SERVER_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          // don't set password from API, keep it empty for security
          setUser((prev) => ({
            ...prev,
            name: res.data.data.name || "",
            email: res.data.data.email || "",
            phone: res.data.data.phone || "",
            password: "",
            confirmPassword: "",
          }));
          setMessage("");
        } else {
          setMessage("Failed to load user profile.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setMessage(err.response?.data?.message || "Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized: Please login.");
      return;
    }

    // Password validation (if user entered password)
    if (user.password && user.password !== user.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const trimmedData = {
        name: user.name.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
      };

      // Include password only if user entered it
      if (user.password) {
        trimmedData.password = user.password;
      }

      const res = await axios.put(
        `${process.env.SERVER_URL}/api/users/profile`,
        trimmedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
        setMessage("✅ Profile updated successfully.");
        setEditMode(false);
      } else {
        setMessage("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("Update failed:", err.response || err.message);
      setMessage(err.response?.data?.message || "❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-indigo-600 text-center font-semibold">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
        Your Profile
      </h2>

      {message && (
        <div
          className={`mb-4 text-sm text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border rounded-md px-3 py-2 mt-1 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border rounded-md px-3 py-2 mt-1 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Phone</label>
          <input
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border rounded-md px-3 py-2 mt-1 disabled:bg-gray-100"
          />
        </div>
        <p className="text-green-500">For Password Reset Edit your Profile</p>

        {/* Password Fields */}
        {editMode && (
          <>
            <div>
              <label className="block text-gray-700 font-medium">New Password</label>
              <input
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={user.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full border rounded-md px-3 py-2 mt-1"
              />
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 bg-green-600 text-white rounded ${
                  saving ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setMessage("");
                  setUser((prev) => ({
                    ...prev,
                    password: "",
                    confirmPassword: "",
                  }));
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
