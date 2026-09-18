import React from 'react'
import Searchbar from '../components/Searchbar'
import { useLocation, useState } from "react";
import api from "../api/axios";
import { useNavigate } from 'react-router-dom';

const CreateTeam = () => {

  const location = useLocation();

  const [teamId, setTeamId] = useState(location.state?.teamId || null);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Team name is required");
      return;
    }

    try {
      const res = await api.post("/create-team", {
        name: teamName,
        description,
      });

      navigate('/home');

      setTeamId(res.data._id);
      setShowModal(false);
      setTeamName("");
      setDescription("");
    } catch (err) {
      alert("Failed to create team");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 sm:py-8 px-3 sm:px-4">

      <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Add Members to Your Team
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Search developers by skill and send them a team request.
          </p>
        </div>


        {/* Create Team First */}
        {!teamId && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 text-center">

            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Create a Team first to start inviting members. If you have a
              team go to Home and start inviting.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Create Team First
            </button>

          </div>
        )}


        {/* Search Developers */}
        {teamId && (
          <div className="bg-white shadow rounded-lg p-2 sm:p-4 overflow-hidden">
            <Searchbar teamId={teamId} />
          </div>
        )}


        {/* Results Info */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <p className="text-gray-700 font-medium">
            Results
          </p>

          <p className="text-gray-500 text-sm mt-1">
            These are the developers found based on the skill you searched for.
          </p>
        </div>

      </div>


      {/* Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3 sm:px-4">

          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 shadow-lg">

            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Create Hackathon Team
            </h2>

            <input
              type="text"
              placeholder="Hackathon Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2.5 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <textarea
              placeholder="Hackathon Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2.5 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTeam}
                className="w-full sm:w-auto px-4 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Create Team
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default CreateTeam