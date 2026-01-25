import React, { useEffect, useState } from 'react';
import api from '../api/axios';
// import './Home.css';
import { useNavigate } from 'react-router-dom'




const Home = () => {
  const [teams, setTeams] = useState([]);

 const [currentUserId, setCurrentUserId] = useState(null)

 const [showJoinPostModal, setShowJoinPostModal] = useState(false);
const [activeTeamId, setActiveTeamId] = useState(null);

const [skillCount, setSkillCount] = useState(1);
const [skills, setSkills] = useState([""]);
const [publicMessage, setPublicMessage] = useState("");



  const navigate = useNavigate()
  
  
  const fetchTeams = async () => {
    try {
      
       const res = await api.get("/my-teams", {withCredentials:true});
       
      setTeams(res.data);
    } catch (error) {
      console.log("Not logged in or no teams");
    }
  };
//
  

//
  useEffect(() => {
    const fetchUser = async()=>{
      // const res = await axios.get("/me")
      const res = await api.get("/me")

      setCurrentUserId(res.data.user._id)
    }
    fetchUser();
    fetchTeams();
  }, []);

  const deleteTeam = async (teamId) =>{
     const confirmation = prompt(
    'Type YES to permanently delete this team'
  );

  if (!confirmation || confirmation.toLowerCase() !== 'yes') {
    alert('Team deletion cancelled');
    return;
  }
    try{
      // await axios.post("/delete-team",{teamId}, {withCredentials:true});
      await api.post("/delete-team",{teamId}, {withCredentials:true});

      fetchTeams();
    }catch(err){
    console.log("DELETE TEAM ERROR:", err.response);
  alert(err.response?.data?.message || "Failed to delete team");
    }
  }

  const handleRename = async (teamId) => {
    const newName = prompt("Enter new team name:");
    if (!newName) return;

    try {
    
      await api.post("/update-team-name", { teamId, newName });

      fetchTeams(); 
    } catch (error) {
      alert("Error renaming");
    }
  };

  const handleAdd = async(teamId)=>{
    navigate("/createteam",{
     state:{teamId}
    })
  }

  return (
      <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        My Teams
      </h2>

      {teams.length === 0 ? (
        <div className="text-gray-600 text-lg">
          No teams yet. First create a team by clicking the "Create Team" page's "Create Team First" button.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {team.name}
                </h3>

                { team.admin._id == currentUserId &&(
                <button
                onClick={()=> deleteTeam(team._id)}
                className="text-sm text-blue-600 hover:underline"
                >Delete Team
                </button>)
}
                

                { team.admin._id == currentUserId && (
                  <button
                  onClick={() => handleRename(team._id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Rename
                </button>)}
              </div>

              <p className="text-sm text-gray-600 mb-4">
  {team.description && team.description.trim() !== ""
    ? team.description
    : "No description provided for this hackathon."}
</p>


              
              {/* <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Members
                </p>
                <div className="flex flex-wrap gap-2">
                  {team.members.map((member) => (
                    <span
                      key={member._id}
                      className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                    >
                      {member.fullname}
                    </span>
                  ))}

                 


                </div>
              </div> */}
             <div className="mb-6">
  <p className="text-sm font-semibold text-gray-700 mb-3">
    Team Members
  </p>

  {/* Accepted */}
  {team.members.length > 0 && (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-2">Accepted</p>
      <div className="flex flex-wrap gap-2">
        {team.members.map(m => (
          <span
            key={m._id}
            className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
          >
            {m.fullname}
          </span>
        ))}
      </div>
    </div>
  )}


  {/* Pending */}
  {team.pendingMembers.length > 0 && (
    <div className="mb-3">
      <p className="text-xs text-gray-500 mb-2">Pending</p>
      <div className="flex flex-wrap gap-2">
        {team.pendingMembers.map(m => (
          <span
            key={m._id}
            className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700"
          >
            {m.fullname}
          </span>
        ))}
      </div>
    </div>
  )}

  {/* Rejected */}
 {team.rejectedMembers.length > 0 && (
  <div>
    <p className="text-xs text-gray-500 mb-2">Rejected</p>

    <div className="flex flex-wrap gap-2">
      {team.rejectedMembers.map(({ _id, user }) => (
        <div
          key={_id}
          className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
        >
          <span>{user.fullname}</span>

          {team.admin._id === currentUserId && (
            <button
              onClick={async () => {
                await api.post("/remove-rejected", { requestId: _id });
                fetchTeams();
              }}
              className="text-xs hover:text-red-900"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>

  </div>
)}

<button
  onClick={() => navigate(`/team/${team._id}/chat`)}
  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
>
  Open Team Chat
</button>


</div>


              

              
              {team.admin._id === currentUserId && (
  <div className="mt-auto flex gap-2">
    <button
      onClick={() => handleAdd(team._id)}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
    >
      Add New Members
    </button>

    {/* <button
      onClick={() => {
        setActiveTeamId(team._id);
        setShowJoinPostModal(true);
      }}
      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition"
    >
      Post Publicly
    </button> */}

    <button
  disabled={team.publicPostCreated}
  onClick={() => {
    if (team.publicPostCreated) return;
    setActiveTeamId(team._id);
    setShowJoinPostModal(true);
  }}
  className={`flex-1 py-2 rounded-lg font-medium transition text-white
    ${
      team.publicPostCreated
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700"
    }
  `}
>
  {team.publicPostCreated ? "Posted Publicly" : "Post Publicly"}
</button>

  </div>
)}


            </div>
          ))}
        </div>
      )}

{showJoinPostModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

      <h2 className="text-lg font-bold mb-4">
        Post Public Join Request
      </h2>

      <label className="block text-sm mb-1">
        How many skills do you need?
      </label>
      <input
        type="number"
        min={1}
        value={skillCount}
        onChange={(e) => {
          const count = Number(e.target.value);
          setSkillCount(count);
          setSkills(Array(count).fill(""));
        }}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      {skills.map((skill, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Skill ${index + 1}`}
          value={skill}
          onChange={(e) => {
            const updated = [...skills];
            updated[index] = e.target.value;
            setSkills(updated);
          }}
          className="w-full border px-3 py-2 rounded mb-2"
        />
      ))}

      <textarea
        placeholder="Message to public (optional)"
        value={publicMessage}
        onChange={(e) => setPublicMessage(e.target.value)}
        rows={3}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowJoinPostModal(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              await api.post("/join-post", {
                teamId: activeTeamId,
                requiredSkills: skills.filter(s => s.trim() !== ""),
                message: publicMessage
              });

              setShowJoinPostModal(false);
              setSkills([""]);
              setSkillCount(1);
              setPublicMessage("");
              setActiveTeamId(null);

              alert("Public join request posted");
            } catch {
              alert("Failed to post join request");
            }
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Post Publicly
        </button>
      </div>

    </div>
  </div>
)}




    </div>
  );
};

export default Home;