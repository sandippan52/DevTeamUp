  import React from 'react'
  // import "./Profile.css"
  import { useEffect } from 'react'
  import { useState } from 'react'
  import api from '../api/axios';


  




  const Profile = () => {

  const [user, setUser] = useState(null)
  // const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
  if (user) {
    setForm(user);
  }
}, [user]);



  useEffect(()=>{
    const fetchData = async()=>{
      try{

        const userRes = await api.get("/me");
        setUser(userRes.data.user)

        // const reqRes = await api.get("/my-requests")
        // setRequests(reqRes.data)

        setLoading(false)

      }catch(error){
        setError("You are not logged in.")
        console.log(error)
        setLoading(false)

      }
    }

    fetchData()


  },[])

  const handleDecline = async(requestId)=>{
try {
   await api.post("/decline-request", { requestId });

} 
catch (err) {
 alert("Failed to decline.")  
}
  }

  const handleAccept = async(req)=>{
    console.log("ACCEPT CLICKED");
    console.log("teamId being sent:", req.team);
    console.log("memberId being sent:", req.receiver);
    try{

        const res = await api.post("/accept-request",{teamId :req.team, memberId : req.receiver, requestID : req._id },{withCredentials:true})
        alert(res.data.message)
        //  setRequests(prev => prev.filter(req => req._id !== requestId))
        //  window.location.href = "/";
         window.location.reload();
    }catch(error){
      console.error("AXIOS ERROR:", error.response?.data || error.message);
      alert("Failed to accept")

    }
  }

  if(loading) return <p>Loading profile....</p>
  if(error) return <p>{error}</p>


    return (
  <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

  {/* ================= HEADER CARD ================= */}
  <div className="bg-white shadow rounded-xl p-6">
    <h2 className="text-2xl font-bold">
      Hello {user.fullname}
    </h2>
    <p className="text-gray-500">
      Welcome to your profile
    </p>

    {user.bio && (
      <div className="mt-4 bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="font-semibold mb-1">Bio</p>
        <p className="text-gray-700">{user.bio}</p>
      </div>
    )}
  </div>

  {/* ================= INFO GRID ================= */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* PERSONAL INFO */}
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-3">
        Personal Information
      </h3>

      <p><b>Full Name:</b> {user.fullname}</p>
      <p><b>University ID:</b> {user.universityId}</p>
      <p><b>Email:</b> {user.email}</p>
    </div>

    {/* EDUCATION INFO */}
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-3">
        Education
      </h3>

      <p><b>College:</b> {user.college}</p>
      <p><b>Course:</b> {user.course}</p>
      <p><b>Year:</b> {user.year}</p>
    </div>

  </div>

  {/* ================= SKILLS CARD ================= */}
  <div className="bg-white shadow rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-3">
      Skills
    </h3>

    <ul className="space-y-2">
      {user.skills.split(",").map((skill, i) => (
        <li key={i} className="flex items-center gap-2">
          🚀 <span>{skill.trim()}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* ================= EDIT BUTTON ================= */}
  <div className="flex justify-end">
    <button
      onClick={() => setShowEdit(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
    >
      Edit Profile
    </button>
  </div>

  {showEdit && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6">

      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

      {["fullname", "universityId", "college", "course", "year", "skills"].map(field => (
        <input
          key={field}
          value={form[field] || ""}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          placeholder={field}
          className="w-full border px-3 py-2 rounded mb-3"
        />
      ))}

      <textarea
        value={form.bio || ""}
        onChange={e => setForm({ ...form, bio: e.target.value })}
        placeholder="Write your bio..."
        rows={3}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowEdit(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            const res = await api.post("/update-profile", form);
            setUser(res.data.user);
            setShowEdit(false);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
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