import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";

const Searchbar = ({ teamId }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

  const [sentRequests, setSentRequests] = useState(new Set());

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      const response = await api.get(`/search?skill=${query}`);
      setResults(response.data);
    } catch (error) {
      console.log("Error searching coders : ", error);
    }
  };

  const handleSendRequestWithMessage = async () => {
    try {
      const res = await api.post("/send-request", {
        receiverId: selectedReceiver,
        teamId,
        message: requestMessage,
      });

      alert(res.data.message);

      setSentRequests((prev) => new Set(prev).add(selectedReceiver));
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
    <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-10 px-3 sm:px-4">

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Search developers by skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Results */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {results.length > 0 ? (
          results.map((coder) => (
            <div
              key={coder._id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-5 flex flex-col gap-3"
            >
              <Link
                to={`/users/${coder._id}`}
                className="font-medium text-blue-600 hover:underline break-words"
              >
                {coder.fullname}
              </Link>

              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">Skills:</span> {coder.skills}
              </p>

              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">College:</span> {coder.college}
              </p>

              <p className="text-sm text-gray-600 break-words">
                <span className="font-medium">University ID:</span>{" "}
                {coder.universityId}
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
                className={`mt-2 w-full px-4 py-2.5 rounded-lg text-white transition ${
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
          <p className="col-span-full text-center text-gray-500 px-2">
            No results found
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">

          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 shadow-lg">

            <h2 className="text-lg sm:text-xl font-bold mb-3">
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
              className="w-full border border-gray-300 px-3 py-2 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

              <button
                onClick={() => {
                  setShowModal(false);
                  setRequestMessage("");
                }}
                className="w-full sm:w-auto px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSendRequestWithMessage}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded"
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

export default Searchbar;