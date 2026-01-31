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

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold">{user.fullname}</h2>

        {user.bio && (
          <div className="mt-3 bg-gray-50 border-l-4 border-blue-500 p-3 rounded">
            {user.bio}
          </div>
        )}
      </div>

      {/* info */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <p><b>University ID:</b> {user.universityId}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-2">Education</h3>
          <p><b>College:</b> {user.college}</p>
          <p><b>Course:</b> {user.course}</p>
          <p><b>Year:</b> {user.year}</p>
        </div>
      </div>

      {/* skills */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-3">Skills</h3>
        {/* <ul className="space-y-1">
          {user.skills.map((skill, i) => (
            <li key={i}>🚀 {skill}</li>
          ))}
        </ul> */}
        <ul className="space-y-1">
  {(Array.isArray(user.skills)
    ? user.skills
    : user.skills.split(",").map(s => s.trim())
  ).map((skill, i) => (
    <li key={i}>🚀 {skill}</li>
  ))}
</ul>

      </div>
    </div>
  );
};

export default UserProfile;
