import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showJoinPostModal, setShowJoinPostModal] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState(null);

  const [skillCount, setSkillCount] = useState(1);
  const [skills, setSkills] = useState([""]);
  const [publicMessage, setPublicMessage] = useState("");

  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await api.get("/my-teams", { withCredentials: true });
      setTeams(res.data);
    } catch (error) {
      console.log("Not logged in or no teams");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/me");
      setCurrentUserId(res.data.user._id);
    };

    fetchUser();
    fetchTeams();
  }, []);

  const deleteTeam = async (teamId) => {
    const confirmation = prompt(
      'Type YES to permanently delete this team'
    );

    if (!confirmation || confirmation.toLowerCase() !== 'yes') {
      alert('Team deletion cancelled');
      return;
    }

    try {
      await api.post(
        "/delete-team",
        { teamId },
        { withCredentials: true }
      );

      fetchTeams();
    } catch (err) {
      console.log("DELETE TEAM ERROR:", err.response);
      alert(err.response?.data?.message || "Failed to delete team");
    }
  };

  const handleRename = async (teamId) => {
    const newName = prompt("Enter new team name:");
    if (!newName) return;

    try {
      await api.post("/update-team-name", {
        teamId,
        newName
      });

      fetchTeams();
    } catch (error) {
      alert("Error renaming");
    }
  };

  const handleAdd = async (teamId) => {
    navigate("/createteam", {
      state: { teamId }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 py-5 sm:py-8">

      {/* Page Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5 sm:mb-8">
        My Teams
      </h2>

      {/* No Teams */}
      {teams.length === 0 ? (
        <div className="text-gray-600 text-sm sm:text-lg max-w-2xl">
          No teams yet. First create a team by clicking the "Create Team"
          page's "Create Team First" button.
        </div>
      ) : (

        /* Teams Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {teams.map((team) => (

            <div
              key={team._id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition min-w-0"
            >

              {/* Team Header */}
              <div className="mb-4">

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 break-words min-w-0">
                    {team.name}
                  </h3>

                  {/* Admin Actions */}
                  {team.admin._id == currentUserId && (
                    <div className="flex items-center gap-3 flex-shrink-0">

                      <button
                        onClick={() => deleteTeam(team._id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Delete Team
                      </button>

                      <button
                        onClick={() => handleRename(team._id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Rename
                      </button>

                    </div>
                  )}

                </div>

              </div>


              {/* Description */}
              <p className="text-sm text-gray-600 mb-5 break-words">
                {team.description && team.description.trim() !== ""
                  ? team.description
                  : "No description provided for this hackathon."}
              </p>


              {/* Team Members */}
              <div className="mb-6">

                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Team Members
                </p>


                {/* Accepted Members */}
                {team.members.length > 0 && (
                  <div className="mb-3">

                    <p className="text-xs text-gray-500 mb-2">
                      Accepted
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {team.members.map((m) => (
                        <span
                          key={m._id}
                          className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-700 break-words"
                        >
                          {m.fullname}
                        </span>
                      ))}
                    </div>

                  </div>
                )}


                {/* Pending Members */}
                {team.pendingMembers.length > 0 && (
                  <div className="mb-3">

                    <p className="text-xs text-gray-500 mb-2">
                      Pending
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {team.pendingMembers.map((m) => (
                        <span
                          key={m._id}
                          className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-yellow-100 text-yellow-700 break-words"
                        >
                          {m.fullname}
                        </span>
                      ))}
                    </div>

                  </div>
                )}


                {/* Rejected Members */}
                {team.rejectedMembers.length > 0 && (
                  <div>

                    <p className="text-xs text-gray-500 mb-2">
                      Rejected
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {team.rejectedMembers.map(({ _id, user }) => (
                        <div
                          key={_id}
                          className="flex items-center gap-2 bg-red-100 text-red-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm max-w-full"
                        >

                          <span className="break-words">
                            {user.fullname}
                          </span>

                          {team.admin._id === currentUserId && (
                            <button
                              onClick={async () => {
                                await api.post("/remove-rejected", {
                                  requestId: _id
                                });
                                fetchTeams();
                              }}
                              className="text-xs hover:text-red-900 flex-shrink-0"
                            >
                              ✕
                            </button>
                          )}

                        </div>
                      ))}

                    </div>

                  </div>
                )}


                {/* Team Chat */}
                <button
                  onClick={() =>
                    navigate(`/team/${team._id}/chat`)
                  }
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                >
                  Open Team Chat
                </button>

              </div>


              {/* Admin Buttons */}
              {team.admin._id === currentUserId && (
                <div className="mt-auto flex flex-col sm:flex-row gap-2">

                  <button
                    onClick={() => handleAdd(team._id)}
                    className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition"
                  >
                    Add New Members
                  </button>

                  <button
                    disabled={team.publicPostCreated}
                    onClick={() => {
                      if (team.publicPostCreated) return;

                      setActiveTeamId(team._id);
                      setShowJoinPostModal(true);
                    }}
                    className={`w-full sm:flex-1 py-2.5 rounded-lg font-medium transition text-white ${
                      team.publicPostCreated
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {team.publicPostCreated
                      ? "Posted Publicly"
                      : "Post Publicly"}
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}


      {/* Public Join Request Modal */}
      {showJoinPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3 sm:px-4">

          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Post Public Join Request
            </h2>


            <label className="block text-sm mb-1">
              How many skills do you need?
            </label>

            <input
              type="number"
              min={1}
              value={skillCount}
              onChange={(e) => {
                const count = Number(e.target.value);

                setSkillCount(count);
                setSkills(Array(count).fill(""));
              }}
              className="w-full border border-gray-300 px-3 py-2.5 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />


            {/* Skills */}
            {skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Skill ${index + 1}`}
                value={skill}
                onChange={(e) => {
                  const updated = [...skills];
                  updated[index] = e.target.value;
                  setSkills(updated);
                }}
                className="w-full border border-gray-300 px-3 py-2.5 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}


            {/* Message */}
            <textarea
              placeholder="Message to public (optional)"
              value={publicMessage}
              onChange={(e) => setPublicMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 px-3 py-2.5 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />


            {/* Modal Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

              <button
                onClick={() => setShowJoinPostModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await api.post("/join-post", {
                      teamId: activeTeamId,
                      requiredSkills: skills.filter(
                        (s) => s.trim() !== ""
                      ),
                      message: publicMessage
                    });

                    setShowJoinPostModal(false);
                    setSkills([""]);
                    setSkillCount(1);
                    setPublicMessage("");
                    setActiveTeamId(null);

                    alert("Public join request posted");
                  } catch {
                    alert("Failed to post join request");
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Post Publicly
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;