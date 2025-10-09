import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaShare, FaComment, FaHeart, FaRegHeart } from "react-icons/fa";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/blogs`;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const token = localStorage.getItem("token");

  // Handle like animation
  const handleLike = () => {
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
    if (!liked) {
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 800);
    }
  };

  // Post comment (name defaults to "Anonymous")
  const postComment = async () => {
    if (!comment.trim()) return alert("Comment cannot be empty!");
    try {
      await axios.post(
        `${API_URL}/${id}/comment`,
        { comment, name: "Anonymous" },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      setComments((prev) => [
        ...prev,
        { id: Date.now(), commenter_name: token ? "You" : "Anonymous", comment },
      ]);

      setComment("");
    } catch (err) {
      console.error("❌ Failed to post comment:", err);
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  // ✅ Fetch blog moved inside useEffect
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${id}`);
        setBlog(res.data);
        setComments(res.data.comments || []);
        setLikeCount(res.data.likes_count || 0);
        setLiked(false);
      } catch (err) {
        console.error("❌ Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Blog post not found
          </h2>
          <p className="text-gray-600">
            The blog post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">Blog Post</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Blog Content */}
        <article className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {blog.image && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${blog.image}`}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-700">
                  {blog.author ? blog.author.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  {blog.author || "Unknown Author"}
                </p>
                <p>
                  {new Date(blog.created_at).toLocaleDateString()} •{" "}
                  {blog.read_time || "5"} min read
                </p>
              </div>
            </div>
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-line">{blog.content}</p>
            </div>
          </div>

          {/* Blog Actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                  liked
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {liked ? (
                  <FaHeart
                    className={`text-red-500 ${
                      likeAnimation ? "animate-ping" : ""
                    }`}
                  />
                ) : (
                  <FaRegHeart />
                )}
                <span>{likeCount}</span>
              </button>
              <div className="flex items-center space-x-1 p-2 rounded-lg text-gray-500">
                <FaComment />
                <span>{comments.length}</span>
              </div>
            </div>
            <button
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: blog.title,
                      text: blog.content.substring(0, 100),
                      url: window.location.href,
                    })
                  : alert("Share this post via link: " + window.location.href)
              }
              className="flex items-center space-x-1 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Comments ({comments.length})
            </h2>
          </div>

          <div className="p-6">
            {comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          {c.commenter_name
                            ? c.commenter_name.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {c.commenter_name || "Anonymous"}
                        </p>
                        <p className="text-gray-600">{c.comment}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Add Comment */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-700">
                  {token ? "Y" : "U"}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={postComment}
                    disabled={!comment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Back Button for Mobile */}
      <div className="md:hidden fixed bottom-4 right-4">
        <button
          onClick={() => window.history.back()}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
