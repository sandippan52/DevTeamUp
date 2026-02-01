
import React from 'react'
import Searchbar from '../components/Searchbar'
import { useLocation } from 'react-router-dom'
import { useState } from "react";
import api from "../api/axios";
import { Link } from 'react-router-dom';


const CreateTeam = () => {

const location = useLocation();
// const teamId = location.state?.teamId

const [teamId, setTeamId] = useState(location.state?.teamId || null);
const [showModal, setShowModal] = useState(false);
const [teamName, setTeamName] = useState("");
const [description, setDescription] = useState("");

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

    window.location.href = "/home";

    setTeamId(res.data._id); 
    setShowModal(false);
    setTeamName("");
    setDescription("");
  } catch (err) {
    alert("Failed to create team");
  }
};







  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
             Add Members to Your Team
          </h2>
          <p className="text-gray-600 mt-1">
            Search developers by skill and send them a team request.
          </p>
        </div>

        {!teamId && (
  <div className="bg-white shadow rounded-lg p-6 text-center">
    <p className="text-gray-700 mb-4">
      You don’t have a team yet. Create one to start inviting members.
    </p>

    <button
      onClick={() => setShowModal(true)}
      className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition"
    >
      Create Team First
    </button>
  </div>
)}


        
        {teamId && (
  <div className="bg-white shadow rounded-lg p-6">
    <Searchbar teamId={teamId} />
  </div>
)}


        
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-700 font-medium">
            Results
          </p>
          <p className="text-gray-500 text-sm mt-1">
            These are the developers found based on the skill you searched for.
          </p>
        </div>

      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Hackathon Team</h2>

      <input
        type="text"
        placeholder="Hackathon Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <textarea
        placeholder="Hackathon Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
        rows={4}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleCreateTeam}
          className="px-4 py-2 bg-green-600 text-white rounded"
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