import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const JoinRequest = () => {
  const [posts, setPosts] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, meRes] = await Promise.all([
          api.get("/join-posts"),
          api.get("/me")
        ]);

        setPosts(postsRes.data);
        setCurrentUserId(meRes.data.user._id);
      } catch (err) {
        console.error("Failed to load join page data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-4 sm:space-y-6">

      {/* Page Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Join Requests
      </h2>

      {posts.map(post => (
        <div
          key={post._id}
          className="bg-white shadow rounded-lg p-4 sm:p-6 min-w-0"
        >

          {/* Team Name */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
            {post.team.name}
          </h3>


          {/* Admin + Delete */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

            <div className="text-sm">
              <span>Admin: </span>

              <Link
                to={`/users/${post.team.admin._id}`}
                className="font-medium text-blue-600 hover:underline break-words"
              >
                {post.team.admin.fullname}
              </Link>
            </div>

            {currentUserId === post.team.admin._id && (
              <button
                onClick={async () => {
                  const confirm = prompt(
                    'Type "YES" to permanently delete this join post'
                  );

                  if (confirm !== "YES") {
                    alert("Deletion cancelled");
                    return;
                  }

                  try {
                    await api.post("/delete-join-post", {
                      postId: post._id
                    });

                    setPosts(prev =>
                      prev.filter(p => p._id !== post._id)
                    );

                    alert("Join post deleted");
                  } catch {
                    alert("Failed to delete post");
                  }
                }}
                className="text-sm text-red-600 hover:underline self-start"
              >
                Delete Post
              </button>
            )}

          </div>


          {/* Accepted Members */}
          {post.team.members.length > 1 && (
            <div className="mt-4">

              <p className="text-xs text-gray-500 mb-1">
                Members
              </p>

              <div className="flex flex-wrap gap-2">
                {post.team.members
                  .filter(m => m._id !== post.team.admin._id)
                  .map(m => (
                    <Link
                      key={m._id}
                      to={`/users/${m._id}`}
                      className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-700 hover:underline break-words"
                    >
                      {m.fullname}
                    </Link>
                  ))}
              </div>

            </div>
          )}


          {/* Pending Members */}
          {post.pendingMembers.length > 0 && (
            <div className="mt-4">

              <p className="text-xs text-gray-500 mb-1">
                Pending
              </p>

              <div className="flex flex-wrap gap-2">
                {post.pendingMembers.map(m => (
                  <Link
                    key={m._id}
                    to={`/users/${m._id}`}
                    className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-yellow-100 text-yellow-700 hover:underline break-words"
                  >
                    {m.fullname}
                  </Link>
                ))}
              </div>

            </div>
          )}


          {/* Team Description */}
          <p className="text-sm sm:text-base text-gray-600 mt-4 break-words">
            {post.team.description}
          </p>


          {/* Public Message */}
          <p className="mt-3 text-sm text-gray-700 break-words">
            {post.message}
          </p>


          {/* Required Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.requiredSkills.map(skill => (
              <span
                key={skill}
                className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm break-words"
              >
                {skill}
              </span>
            ))}
          </div>


          {/* Request Button */}
          <button
            disabled={post.alreadyApplied}
            onClick={() => {
              if (post.alreadyApplied) return;

              setActivePost(post);
              setSelectedSkill("");
              setMessage("");
              setShowApplyModal(true);
            }}
            className={`mt-5 w-full sm:w-auto px-5 py-2.5 rounded-lg text-white transition ${
              post.alreadyApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {post.alreadyApplied
              ? "Request Sent"
              : "Request to Join"}
          </button>

        </div>
      ))}


      {/* Apply Modal */}
      {showApplyModal && activePost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3 sm:px-4">

          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg sm:text-xl font-bold mb-4 break-words">
              Request to Join — {activePost.team.name}
            </h2>


            {/* Skill Selection */}
            <label className="block text-sm mb-1">
              Select a skill
            </label>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2.5 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select skill</option>

              {activePost.requiredSkills.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>


            {/* Message */}
            <textarea
              placeholder="Message to team admin (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 px-3 py-2.5 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />


            {/* Modal Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

              <button
                onClick={() => setShowApplyModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!selectedSkill) {
                    alert("Please select a skill");
                    return;
                  }

                  try {
                    await api.post("/apply-join", {
                      postId: activePost._id,
                      selectedSkill,
                      message
                    });

                    setShowApplyModal(false);
                    alert("Request sent successfully");
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                      "Failed to send request"
                    );
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Send Request
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default JoinRequest;