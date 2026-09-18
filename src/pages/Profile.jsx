import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import api from '../api/axios';

const Profile = () => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const userRes = await api.get("/me");
        setUser(userRes.data.user)

        setLoading(false)

      } catch (error) {
        setError("You are not logged in.")
        console.log(error)
        setLoading(false)
      }
    }

    fetchData()

  }, [])

  const handleDecline = async (requestId) => {
    try {
      await api.post("/decline-request", { requestId });
    }
    catch (err) {
      alert("Failed to decline.")
    }
  }

  const handleAccept = async (req) => {
    console.log("ACCEPT CLICKED");
    console.log("teamId being sent:", req.team);
    console.log("memberId being sent:", req.receiver);

    try {

      const res = await api.post(
        "/accept-request",
        {
          teamId: req.team,
          memberId: req.receiver,
          requestID: req._id
        },
        {
          withCredentials: true
        }
      )

      alert(res.data.message)
      window.location.reload();

    } catch (error) {
      console.error("AXIOS ERROR:", error.response?.data || error.message);
      alert("Failed to accept")
    }
  }

  if (loading) {
    return (
      <p className="text-center mt-10 px-4">
        Loading profile....
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 px-4 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-5 sm:space-y-6">

      {/* Header card */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6 min-w-0">

        <h2 className="text-xl sm:text-2xl font-bold break-words">
          Hello {user.fullname}
        </h2>

        <p className="text-sm sm:text-base text-gray-500">
          Welcome to your profile
        </p>

        {user.bio && (
          <div className="mt-4 bg-gray-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">

            <p className="font-semibold mb-1">
              Bio
            </p>

            <p className="text-sm sm:text-base text-gray-700 break-words whitespace-pre-wrap">
              {user.bio}
            </p>

          </div>
        )}

      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

        {/* Personal info */}
        <div className="bg-white shadow rounded-xl p-4 sm:p-6 min-w-0">

          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Personal Information
          </h3>

          <div className="space-y-2 text-sm sm:text-base">
            <p className="break-words">
              <b>Full Name:</b> {user.fullname}
            </p>

            <p className="break-words">
              <b>University ID:</b> {user.universityId}
            </p>

            <p className="break-words">
              <b>Email:</b> {user.email}
            </p>
          </div>

        </div>

        {/* Education info */}
        <div className="bg-white shadow rounded-xl p-4 sm:p-6 min-w-0">

          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Education
          </h3>

          <div className="space-y-2 text-sm sm:text-base">
            <p className="break-words">
              <b>College:</b> {user.college}
            </p>

            <p className="break-words">
              <b>Course:</b> {user.course}
            </p>

            <p className="break-words">
              <b>Year:</b> {user.year}
            </p>
          </div>

        </div>

      </div>

      {/* Skills card */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6 min-w-0">

        <h3 className="text-base sm:text-lg font-semibold mb-3">
          Skills
        </h3>

        <ul className="space-y-2">

          {user.skills.split(",").map((skill, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm sm:text-base break-words"
            >
              <span className="flex-shrink-0">🚀</span>
              <span className="break-words">
                {skill.trim()}
              </span>
            </li>
          ))}

        </ul>

      </div>

      {/* Edit button */}
      <div className="flex justify-end">

        <button
          onClick={() => setShowEdit(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 sm:py-2 rounded-lg"
        >
          Edit Profile
        </button>

      </div>

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3 sm:px-4 py-5">

          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-bold mb-4">
              Edit Profile
            </h2>

            {[
              "fullname",
              "universityId",
              "college",
              "course",
              "year",
              "skills"
            ].map(field => (
              <input
                key={field}
                value={form[field] || ""}
                onChange={e =>
                  setForm({
                    ...form,
                    [field]: e.target.value
                  })
                }
                placeholder={field}
                className="w-full border px-3 py-2.5 sm:py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}

            <textarea
              value={form.bio || ""}
              onChange={e =>
                setForm({
                  ...form,
                  bio: e.target.value
                })
              }
              placeholder="Write your bio..."
              rows={3}
              className="w-full border px-3 py-2.5 sm:py-2 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">

              <button
                onClick={() => setShowEdit(false)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const res = await api.post("/update-profile", form);
                  setUser(res.data.user);
                  setShowEdit(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Profile