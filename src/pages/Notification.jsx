import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Notification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRejected, setSentRejected] = useState([]);

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [joinApplications, setJoinApplications] = useState([]);

  const [joinRejected, setJoinRejected] = useState([]);

  const handleConfirmDecline = async () => {
    try {
      if (selectedRequest.post) {
        await api.post("/reject-join", {
          applicationId: selectedRequest._id,
          reason: declineReason
        });

        setJoinApplications(prev =>
          prev.filter(a => a._id !== selectedRequest._id)
        );
      } else {
        await api.post("/decline-request", {
          requestId: selectedRequest._id,
          reason: declineReason
        });

        setRequests(prev =>
          prev.filter(r => r._id !== selectedRequest._id)
        );
      }

      setShowDeclineModal(false);
      setDeclineReason("");
      setSelectedRequest(null);
    } catch {
      alert("Failed to decline");
    }
  };

  const handleAcceptJoin = async (app) => {
    try {
      const res = await api.post("/accept-join", {
        applicationId: app._id
      });

      alert(res.data.message || "Applicant added to team");

      setJoinApplications(prev =>
        prev.filter(a => a._id !== app._id)
      );
    } catch (err) {
      alert("Failed to accept join request");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const incoming = await api.get("/my-requests");
        const rejected = await api.get("/sent-requests");
        const joinApps = await api.get("/join-applications");
        const rejectedJoins = await api.get("/my-join-rejections");

        setJoinRejected(rejectedJoins.data);
        setRequests(incoming.data);
        setSentRejected(rejected.data);
        setJoinApplications(joinApps.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDeleteDeclined = async (requestId) => {
    try {
      await api.post("/remove-rejected", { requestId });

      setSentRejected(prev =>
        prev.filter(r => r._id !== requestId)
      );
    } catch {
      alert("Failed to delete notification");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await api.post("/decline-request", { requestId });
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch {
      alert("Failed to decline");
    }
  };

  const handleAccept = async (req) => {
    try {
      const res = await api.post("/accept-request", {
        teamId: req.team,
        memberId: req.receiver,
        requestID: req._id
      });

      alert(res.data.message);
      setRequests(prev => prev.filter(r => r._id !== req._id));
    } catch {
      alert("Failed to accept");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 px-4">
        Loading notifications...
      </p>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8">

      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
        Notifications
      </h2>

      {/* Direct team invite */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        Team Invitations
      </h3>

      {requests.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          No new team invitations.
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow rounded-lg p-4 sm:p-5 flex flex-col gap-3 min-w-0"
            >
              <div className="min-w-0">

                <Link
                  to={`/users/${req.sender._id}`}
                  className="font-medium text-blue-600 hover:underline break-words"
                >
                  {req.sender.fullname}
                </Link>

                <p className="text-sm text-gray-500 mt-1 break-words">
                  Skills: {req.sender.skills} · College: {req.sender.college}
                </p>

                {req.message && (
                  <div className="mt-2 bg-gray-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm text-gray-700 break-words">
                      <span className="font-medium">Message:</span>{" "}
                      {req.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => handleAccept(req)}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>

                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setShowDeclineModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Public Join Application */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        Public Join Applications
      </h3>

      {joinApplications.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-500 mb-8">
          No public join applications.
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {joinApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white border rounded-lg p-4 sm:p-5 flex flex-col gap-2 min-w-0"
            >

              <Link
                to={`/users/${app.applicant._id}`}
                className="font-medium text-blue-600 hover:underline break-words"
              >
                {app.applicant.fullname}
              </Link>

              <p className="text-sm text-gray-600 break-words">
                Team: <b>{app.post.team.name}</b>
              </p>

              <p className="text-sm text-gray-600 break-words">
                Skill: <b>{app.selectedSkill}</b>
              </p>

              {app.message && (
                <div className="bg-gray-50 border-l-4 border-blue-500 p-2 text-sm break-words">
                  {app.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-2">
                <button
                  onClick={() => handleAcceptJoin(app)}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>

                <button
                  onClick={() => {
                    setSelectedRequest(app);
                    setDeclineReason("");
                    setShowDeclineModal(true);
                  }}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Declined request(sender side) */}
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        Declined Requests
      </h3>

      {sentRejected.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-500">
          No declined requests.
        </p>
      ) : (
        <div className="space-y-4">
          {sentRejected.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow rounded-lg p-4 sm:p-5 min-w-0"
            >
              <Link
                to={`/users/${req.receiver._id}`}
                className="font-medium text-blue-600 hover:underline break-words"
              >
                {req.receiver.fullname}
              </Link>

              {req.declineReason && (
                <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-sm text-red-700 break-words">
                    <span className="font-semibold">Reason:</span>{" "}
                    {req.declineReason}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleDeleteDeclined(req._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Declined public join request */}
      <h3 className="text-base sm:text-lg font-semibold mb-4 mt-8 text-gray-800">
        Declined Public Join Requests
      </h3>

      {joinRejected.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-500">
          No declined public join requests.
        </p>
      ) : (
        <div className="space-y-4">
          {joinRejected.map(app => (
            <div
              key={app._id}
              className="bg-white shadow rounded-lg p-4 sm:p-5 min-w-0"
            >
              <p className="font-medium text-gray-800 break-words">
                Your request to join <b>{app.post.team.name}</b> was declined
              </p>

              {app.declineReason && (
                <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-sm text-red-700 break-words">
                    <b>Reason:</b> {app.declineReason}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <button
                  onClick={async () => {
                    await api.post("/delete-join-rejection", {
                      applicationId: app._id
                    });

                    setJoinRejected(prev =>
                      prev.filter(a => a._id !== app._id)
                    );
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3 sm:px-4 py-6">

          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-bold mb-3">
              Decline Request
            </h2>

            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Type the reason you declined the request"
              rows={4}
              className="w-full border px-3 py-2 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

              <button
                onClick={() => setShowDeclineModal(false)}
                className="w-full sm:w-auto px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDecline}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Send Reason
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notification;