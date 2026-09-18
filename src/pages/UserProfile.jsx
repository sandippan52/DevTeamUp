import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get(`/users/${userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <p className="text-center mt-10 px-4">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8">

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-5 sm:mb-6 min-w-0">

        <h2 className="text-xl sm:text-2xl font-bold break-words">
          {user.fullname}
        </h2>

        {user.bio && (
          <div className="mt-3 bg-gray-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-sm sm:text-base text-gray-700 break-words whitespace-pre-wrap">
              {user.bio}
            </p>
          </div>
        )}

      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0">

          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Personal Information
          </h3>

          <div className="space-y-2 text-sm sm:text-base">

            <p className="break-words">
              <b>University ID:</b> {user.universityId}
            </p>

            <p className="break-words">
              <b>Email:</b> {user.email}
            </p>

          </div>

        </div>

        {/* Education */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0">

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

      {/* Skills */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0">

        <h3 className="text-base sm:text-lg font-semibold mb-3">
          Skills
        </h3>

        <ul className="space-y-2">

          {(Array.isArray(user.skills)
            ? user.skills
            : user.skills.split(",").map(s => s.trim())
          ).map((skill, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm sm:text-base break-words"
            >
              <span className="flex-shrink-0">🚀</span>
              <span className="break-words">
                {skill}
              </span>
            </li>
          ))}

        </ul>

      </div>

    </div>
  );
};

export default UserProfile;