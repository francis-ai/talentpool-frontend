import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("view");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/announcement`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setErrorMessage("Failed to fetch announcements");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async () => {
    if (!title || !content) {
      setErrorMessage("Please fill in both title and content.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/announcement`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Announcement created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setTitle("");
      setContent("");
      fetchAnnouncements();
      setActiveTab("view");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to create announcement");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setIsEditing(true);
    setEditId(announcement.id);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setActiveTab("create");
  };

  const handleUpdate = async () => {
    if (!editTitle || !editContent) {
      setErrorMessage("Please fill in both title and content.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setEditLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/announcement/${editId}`,
        { title: editTitle, content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Announcement updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
      setEditId(null);
      setEditTitle("");
      setEditContent("");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update announcement");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setDeleteLoadingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/announcement/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Announcement deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to delete announcement");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setTitle("");
    setContent("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Announcement Dashboard</h1>
          <p className="text-gray-600">Create and manage your announcements</p>
        </div>

        {/* Notification Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 transition-opacity duration-300">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 transition-opacity duration-300">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === "create" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => {
                setActiveTab("create");
                if (isEditing) cancelEdit();
              }}
            >
              <i className="fas fa-plus-circle mr-2"></i>
              {isEditing ? "Edit Announcement" : "Create Announcement"}
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === "view" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("view")}
            >
              <i className="fas fa-list mr-2"></i>View Announcements
            </button>
          </div>

          <div className="p-6">
            {/* Create/Edit Form */}
            {activeTab === "create" && (
              <div className="fade-in">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {isEditing ? "Edit Announcement" : "Create New Announcement"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={isEditing ? editTitle : title}
                      onChange={(e) => isEditing ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={isEditing ? editContent : content}
                      onChange={(e) => isEditing ? setEditContent(e.target.value) : setContent(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter announcement content"
                      rows={5}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={isEditing ? handleUpdate : handleCreate}
                      disabled={isEditing ? editLoading : loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                      {isEditing ? (
                        editLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save mr-2"></i>
                            Update Announcement
                          </>
                        )
                      ) : (
                        loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            Create Announcement
                          </>
                        )
                      )}
                    </button>
                    {isEditing && (
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Announcements List */}
            {activeTab === "view" && (
              <div className="fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">All Announcements</h2>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="bg-blue-100 text-blue-600 py-1 px-3 rounded-lg text-sm hover:bg-blue-200 transition flex items-center"
                  >
                    <i className="fas fa-plus mr-1"></i> New
                  </button>
                </div>

                {announcements.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-bullhorn text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-500">No announcements yet.</p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Create your first announcement
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="border border-gray-200 p-5 rounded-xl bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{ann.title}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded-full">
                            {formatDate(ann.created_at || ann.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line mb-4">{ann.content}</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(ann)}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                          >
                            <i className="fas fa-edit mr-1"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ann.id)}
                            disabled={deleteLoadingId === ann.id}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center disabled:opacity-50"
                          >
                            {deleteLoadingId === ann.id ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-1"></i> Deleting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-trash mr-1"></i> Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{announcements.length}</div>
            <div className="text-gray-600">Total Announcements</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">
              {announcements.filter(a => new Date(a.created_at || a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-gray-600">This Week</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">
              {announcements.filter(a => new Date(a.created_at || a.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-gray-600">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;