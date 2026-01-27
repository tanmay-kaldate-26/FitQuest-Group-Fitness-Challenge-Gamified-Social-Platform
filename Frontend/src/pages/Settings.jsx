import "./Settings.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [userData, setUserData] = useState({ fullName: "", bio: "", email: "" });

    // Password State
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    const [loading, setLoading] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);

    // 1. Fetch current data
    useEffect(() => {
        api.get("/users/profile").then(res => {
            console.log("Profile Data Loaded:", res.data);
            setUserData(res.data);
        }).catch(err => console.error("Failed to load profile", err));
    }, []);

    // 2. Handle Profile Save
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await api.put("/users/profile", {
                fullName: userData.fullName,
                bio: userData.bio
            });
            alert("✅ Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("❌ Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Password Update (Real Backend Call)
    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            return alert("Please fill in all password fields.");
        }
        if (passwords.new !== passwords.confirm) {
            return alert("New passwords do not match.");
        }
        if (passwords.new.length < 6) {
            return alert("Password must be at least 6 characters.");
        }

        setPwdLoading(true);
        try {
            await api.put("/users/password", {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            alert("✅ Password changed successfully!");
            setPasswords({ current: "", new: "", confirm: "" }); // Clear fields
        } catch (error) {
            console.error(error);
            alert("❌ Failed to update password. " + (error.response?.data || "Check current password."));
        } finally {
            setPwdLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <Navbar />
            <div className="settings-container">
                <h1>Settings</h1>
                <p className="subtitle">Manage your account settings and preferences</p>

                {/* TABS (Removed Notifications and Preferences) */}
                <div className="settings-tabs">
                    {['profile', 'security'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="settings-content">

                    {/* --- PROFILE TAB --- */}
                    {activeTab === "profile" && (
                        <div className="tab-section fade-in">
                            <h3>Profile Information</h3>

                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={userData.fullName || ""}
                                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Email Address (Read Only)</label>
                                <input type="email" value={userData.email || ""} disabled className="disabled-input" />
                            </div>

                            <div className="input-group">
                                <label>Bio</label>
                                <textarea
                                    value={userData.bio || ""}
                                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                ></textarea>
                            </div>

                            <div className="action-row">
                                <button className="save-btn" onClick={handleSaveProfile} disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- SECURITY TAB --- */}
                    {activeTab === "security" && (
                        <div className="tab-section fade-in">
                            <h3>Security Settings</h3>
                            <div className="input-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>
                            <button className="save-btn" onClick={handleUpdatePassword} disabled={pwdLoading}>
                                {pwdLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    )}

                    {/* --- PREFERENCES TAB (Commented Out) --- */}
                    {/* {activeTab === "preferences" && (
                        <div className="tab-section fade-in">
                            <h3>App Preferences</h3>
                            <div className="pref-box">
                                <h4>⚠️ Dark Mode</h4>
                                <p>Use the toggle in the top navigation bar.</p>
                            </div>

                            <div className="danger-zone">
                                <h4>🚨 Danger Zone</h4>
                                <p>Once you delete your account, there is no going back. Please be certain.</p>
                                <button className="delete-btn" onClick={() => alert("Delete feature requires backend implementation.")}>Delete Account</button>
                            </div>
                        </div>
                    )} 
                    */}

                </div>
            </div>
        </div>
    );
}