
import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import api from "../api/axios"; 


const Searchbar = ({teamId}) => {

const [query, setQuery] = useState("");
const [results, setResults] = useState([]);

const [showModal, setShowModal] = useState(false);
const [selectedReceiver, setSelectedReceiver] = useState(null);
const [requestMessage, setRequestMessage] = useState("");



const [sentRequests, setSentRequests] = useState(new Set())


const handleSearch = async(e)=>{
  e.preventDefault();

  if(!query.trim()) return;

  try{
    const response = await api.get(`/search?skill=${query}`)

    setResults(response.data)
  }
  catch(error){
    console.log("Error searching coders : ", error);
  }

}

const handleSendRequestWithMessage = async () => {
  try {
    const res = await api.post("/send-request", {
      receiverId: selectedReceiver,
      teamId,
      message: requestMessage,
    });

    alert(res.data.message);

    setSentRequests(prev => new Set(prev).add(selectedReceiver));
    setShowModal(false);
    setRequestMessage("");
    setSelectedReceiver(null);

  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Something went wrong");
    }
  }
};






  return (
     <div className="max-w-4xl mx-auto mt-10 px-4">
      
    
      <form
        onSubmit={handleSearch}
        className="flex gap-3 bg-white p-4 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Search developers by skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.length > 0 ? (
          results.map(coder => (
            <div
              key={coder._id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3"
            >
              {/* <h3 className="text-lg font-semibold text-gray-800">
                {coder.fullname}
              </h3> */}
              <Link
             to={`/users/${coder._id}`}
             className="font-medium text-blue-600 hover:underline">
              {coder.fullname}
              </Link>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Skills:</span> {coder.skills}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">College:</span> {coder.college}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">University ID:</span> {coder.universityId}
              </p>


              <p className="text-sm text-gray-600">
                <span className="font-medium">Year:</span> {coder.year}
              </p>

              <button
                onClick={() => {
  setSelectedReceiver(coder._id);
  setShowModal(true);
}}
                disabled={sentRequests.has(coder._id)}
                className={`mt-3 px-4 py-2 rounded-lg text-white transition
                  ${
                    sentRequests.has(coder._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {sentRequests.has(coder._id)
                  ? "Request Sent"
                  : "Request to Join"}
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No results found
          </p>
        )}
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

      <h2 className="text-xl font-bold mb-3">
        Send Join Request
      </h2>

      <p className="text-sm text-gray-600 mb-3">
        Type the message you want to share with the coder.
      </p>

      <textarea
        value={requestMessage}
        onChange={(e) => setRequestMessage(e.target.value)}
        rows={4}
        placeholder="Hey! We'd love to have you on our hackathon team..."
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowModal(false);
            setRequestMessage("");
          }}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSendRequestWithMessage}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Send Request
        </button>
      </div>
    </div>
  </div>
)}


      
      
    </div>
  )
}

export default Searchbar