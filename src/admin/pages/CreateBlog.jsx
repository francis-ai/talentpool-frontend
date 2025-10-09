import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const blogsPerPage = 5;

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch blogs", "error");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); // ✅ only include actual reactive dependencies

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show message with type
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", tags);
      if (image) formData.append("image", image);

      if (editingId) {
        // UPDATE
        await axios.put(`${API_URL}/api/blogs/${editingId}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        });
        showMessage("Blog updated successfully!");
      } else {
        // CREATE
        await axios.post(`${API_URL}/api/blogs/create`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        });
        showMessage("Blog posted successfully!");
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to process blog", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setTags(blog.tags);
    setEditingId(blog.id);
    setImage(null);
    setImagePreview(blog.image ? `${API_URL}/api/blogs/uploads/${blog.image}` : null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;

    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Blog deleted successfully!");
      fetchBlogs();
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete blog", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto p-6">
        <div className="mt-16">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {editingId ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              rows="8"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Separate tags with commas (e.g., technology, design, business)"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : editingId ? "Update Blog Post" : "Publish Blog Post"}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Blog Posts</h3>
          
          <div className="mt-3 md:mt-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search blogs..."
              className="w-full md:w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoading && blogs.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : currentBlogs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchTerm ? "No blogs match your search." : "No blogs found. Create your first blog post!"}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {currentBlogs.map((blog) => (
                <div key={blog.id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex flex-col md:flex-row">
                    {blog.image && (
                      <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                        <img
                          src={`${API_URL}/api/blogs/uploads/${blog.image}`}
                          alt={blog.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className={blog.image ? "md:w-3/4" : "w-full"}>
                      <h4 className="font-bold text-lg text-gray-800">{blog.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        By {blog.created_by} | {new Date(blog.created_at).toLocaleString()}
                      </p>
                      <p className="text-gray-700 mb-3 line-clamp-3">{blog.content}</p>
                      {blog.tags && (
                        <p className="text-sm text-gray-500 mb-3">
                          Tags: {blog.tags}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1.5 rounded-md border border-gray-300 ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminBlog;