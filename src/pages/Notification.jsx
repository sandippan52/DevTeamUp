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



//   const handleConfirmDecline = async () => {
//   try {
//     await api.post("/decline-request", {
//       requestId: selectedRequest._id,
//       reason: declineReason
//     });

//     setRequests(prev =>
//       prev.filter(r => r._id !== selectedRequest._id)
//     );

//     setShowDeclineModal(false);
//     setDeclineReason("");
//     setSelectedRequest(null);

//   } catch {
//     alert("Failed to decline request");
//   }
// };


const handleConfirmDecline = async () => {
  try {
    if (selectedRequest.post) {
      // public join application
      await api.post("/reject-join", {
        applicationId: selectedRequest._id,
        reason: declineReason
      });

      setJoinApplications(prev =>
        prev.filter(a => a._id !== selectedRequest._id)
      );
    } else {
      // direct team invite
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



  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     try {
  //       const res = await api.get("/my-requests");
  //       setRequests(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRequests();
  // }, []);
//   useEffect(() => {
//   const fetchAll = async () => {
//     try {
//       const incoming = await api.get("/my-requests");
//       const rejected = await api.get("/sent-requests");

//       setRequests(incoming.data);
//       setSentRejected(rejected.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAll();
// }, []);

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

  if (loading) return <p className="text-center mt-10">Loading notifications...</p>;

  return (
    
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
      Notifications
    </h2>

    {/* ================= DIRECT TEAM INVITES ================= */}
    <h3 className="text-lg font-semibold text-gray-800 mb-3">
      Team Invitations
    </h3>

    {requests.length === 0 ? (
      <p className="text-gray-500 mb-6">No new team invitations.</p>
    ) : (
      <div className="space-y-4 mb-8">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
          >
            <div>
              {/* <p className="font-medium text-gray-800">
                {req.sender.fullname}
              </p> */}
              <Link
             to={`/users/${req.sender._id}`}
             className="font-medium text-blue-600 hover:underline">
              {req.sender.fullname}
              </Link>

              <p className="text-sm text-gray-500">
                Skills: {req.sender.skills} · College: {req.sender.college}
              </p>

              {req.message && (
                <div className="mt-2 bg-gray-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Message:</span>{" "}
                    {req.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleAccept(req)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Accept
              </button>

              <button
                onClick={() => {
                  setSelectedRequest(req);
                  setShowDeclineModal(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* ================= PUBLIC JOIN APPLICATIONS ================= */}
    <h3 className="text-lg font-semibold text-gray-800 mb-3">
      Public Join Applications
    </h3>

    {joinApplications.length === 0 ? (
      <p className="text-gray-500 mb-8">
        No public join applications.
      </p>
    ) : (
      <div className="space-y-4 mb-8">
        {joinApplications.map((app) => (
          <div
            key={app._id}
            className="bg-white border rounded-lg p-4 flex flex-col gap-2"
          >
            {/* <p className="font-medium text-gray-800">
              {app.applicant.fullname}
            </p> */}

            <Link
             to={`/users/${app.applicant._id}`}
             className="font-medium text-blue-600 hover:underline">
              {app.applicant.fullname}
              </Link>


            <p className="text-sm text-gray-600">
              Team: <b>{app.post.team.name}</b>
            </p>

            <p className="text-sm text-gray-600">
              Skill: <b>{app.selectedSkill}</b>
            </p>

            {app.message && (
              <div className="bg-gray-50 border-l-4 border-blue-500 p-2 text-sm">
                {app.message}
              </div>
            )}

            <div className="flex gap-2 justify-end mt-2">
              <button
                 onClick={() => handleAcceptJoin(app)}
  className="px-3 py-1 bg-green-600 text-white rounded"
                
              >
                Accept
              </button>

              <button
                onClick={() => {
                  
    setSelectedRequest(app);
    setDeclineReason("");
    setShowDeclineModal(true);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* ================= DECLINED REQUESTS (SENDER SIDE) ================= */}
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Declined Requests
    </h3>

    {sentRejected.length === 0 ? (
      <p className="text-gray-500">No declined requests.</p>
    ) : (
      <div className="space-y-4">
        {sentRejected.map((req) => (
  <div
    key={req._id}
    className="bg-white shadow rounded-lg p-4"
  >
    {/* <p className="font-medium text-gray-800">
      {req.receiver.fullname} declined your request
    </p> */}
            <Link
             to={`/users/${req.receiver._id}`}
             className="font-medium text-blue-600 hover:underline">
              {req.receiver.fullname}
              </Link>

    {req.declineReason && (
      <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
        <p className="text-sm text-red-700">
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


    {/* ================= DECLINED PUBLIC JOIN REQUESTS ================= */}
<h3 className="text-lg font-semibold mb-4 text-gray-800">
  Declined Public Join Requests
</h3>

{joinRejected.length === 0 ? (
  <p className="text-gray-500">No declined public join requests.</p>
) : (
  <div className="space-y-4">
    {joinRejected.map(app => (
      <div
        key={app._id}
        className="bg-white shadow rounded-lg p-4"
      >
        <p className="font-medium text-gray-800">
          Your request to join <b>{app.post.team.name}</b> was declined
        </p>

        {app.declineReason && (
          <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="text-sm text-red-700">
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


    {/* ================= DECLINE MODAL ================= */}
    {showDeclineModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-md p-6">
          <h2 className="text-lg font-bold mb-3">
            Decline Request
          </h2>

          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Type the reason you declined the request"
            rows={4}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeclineModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDecline}
              className="px-4 py-2 bg-red-600 text-white rounded"
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
