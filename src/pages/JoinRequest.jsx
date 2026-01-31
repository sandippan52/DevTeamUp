
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



  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const res = await api.get("/join-posts");
  //     setPosts(res.data);
  //   };
  //   fetchPosts();
  // }, []);
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-bold">Join Requests</h2>

      {posts.map(post => (
        <div
          key={post._id}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold">
            {post.team.name}
          </h3>
 
<span>Admin: </span>
<Link to={`/users/${post.team.admin._id}`} className="font-medium text-blue-600 hover:underline">
{post.team.admin.fullname}
</Link>
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
    className="ml-4 text-sm text-red-600 hover:underline"
  >
    Delete Post
  </button>
)}



{post.team.members.length > 1 && (
  <div className="mt-2">
    <p className="text-xs text-gray-500 mb-1">Members</p>
    <div className="flex flex-wrap gap-2">
      {post.team.members
        .filter(m => m._id !== post.team.admin._id)
        .map(m => (
          <Link
            key={m._id}
            to={`/users/${m._id}`}
            className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 hover:underline"
          >
            {m.fullname}
          </Link>
        ))}
    </div>
  </div>
)}


{post.pendingMembers.length > 0 && (
  <div className="mt-2">
    <p className="text-xs text-gray-500 mb-1">Pending</p>
    <div className="flex flex-wrap gap-2">
      {post.pendingMembers.map(m => (
        <Link
          key={m._id}
          to={`/users/${m._id}`}
          className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700 hover:underline"
        >
          {m.fullname}
        </Link>
      ))}
    </div>
  </div>
)}








          <p className="text-gray-600 mt-1">
            {post.team.description}
          </p>

          <p className="mt-3 text-sm text-gray-700">
            {post.message}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {post.requiredSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* <button
  onClick={() => {
    setActivePost(post);
    setSelectedSkill("");
    setMessage("");
    setShowApplyModal(true);
  }}
  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
>
  Request to Join
</button> */}
<button
  disabled={post.alreadyApplied}
  onClick={() => {
    if (post.alreadyApplied) return;
    setActivePost(post);
    setSelectedSkill("");
    setMessage("");
    setShowApplyModal(true);
  }}
  className={`mt-4 px-4 py-2 rounded text-white transition
    ${
      post.alreadyApplied
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }
  `}
>
  {post.alreadyApplied ? "Request Sent" : "Request to Join"}
</button>


        </div>
      ))}

      {showApplyModal && activePost && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

      <h2 className="text-lg font-bold mb-4">
        Request to Join — {activePost.team.name}
      </h2>

      <label className="block text-sm mb-1">
        Select a skill
      </label>
      <select
        value={selectedSkill}
        onChange={(e) => setSelectedSkill(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      >
        <option value="">Select skill</option>
        {activePost.requiredSkills.map(skill => (
          <option key={skill} value={skill}>
            {skill}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Message to team admin (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowApplyModal(false)}
          className="px-4 py-2 border rounded"
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
                err.response?.data?.message || "Failed to send request"
              );
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
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
