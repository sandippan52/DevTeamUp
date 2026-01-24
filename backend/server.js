import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import mongoose from 'mongoose'

import { Coder } from './models/DevData.js'
import { Request } from './models/Request1.js'
import { Team } from './models/Team1.js'
import { JoinPost } from "./models/JoinPost.js";
import { JoinApplication } from "./models/JoinApplication.js";
import { ChatMessage } from './models/ChatMessage.js'


import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import bcrypt from 'bcryptjs'






await mongoose.connect(process.env.MONGO_URL)

const app = express()
const port = process.env.PORT || 3000


app.use(cors({
   origin:["http://localhost:5173",
    process.env.FRONTEND_URL
   ],
   credentials: true }))
app.use(express.json()); 


const __filename = fileURLToPath(import.meta.url) 
const __dirname = path.dirname(__filename)







app.use(session({

    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl:process.env.MONGO_URL}),
    cookie : { 
      maxAge : 1000*60*60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
      }


}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.post("/signup", async(req,res)=>{


  try{
  const {fullname, universityId, email, password, skills, college, course, year} = req.body

  const hashedPassword = await bcrypt.hash(password,10)

  const existing = await Coder.findOne({email})

  if(existing){
  return res.status(400).json({message : "User already exists."})
  }

const newCoder = new Coder({fullname:fullname, universityId:universityId, email:email, password: hashedPassword, skills:skills, college:college,course:course, year:year})


await newCoder.save();

res.status(201).json({message:"User saved successfully."})
  } catch(err){
    console.log(err)
    res.status(500).json({message:"Error in signning up."})

  }



})

app.post("/login",async(req,res)=>{
  const {email, password} = req.body

  const user = await Coder.findOne({email})

  if(!user) return res.status(400).send("user not found")

    const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) return res.status(400).send("Invalid Credential") 
    
    req.session.userId = user._id;
    
    res.status(200).json({
      message: "Login successful",
      user:{
        id: user._id,
        username : user.fullname,
        email : user.email
      }
    })

})

function requireLogin(req, res, next){
  if(!req.session.userId){
    return res.status(401).json({message:"Unauthorized"})
  }
next()

}

app.post("/logout", (req,res)=>{
  req.session.destroy(()=>{
    res.clearCookie("hackathonmatcher.sid");
    res.json({message:"Logged Out"})
  })
})

app.get("/me", async(req,res)=>{
if(!req.session.userId){
   return res.status(401).json({loggedIn : false})
}

const user = await Coder.findById(req.session.userId).select("-password")
res.json({
  loggedIn:true,
  user
})

})

app.get("/search",requireLogin, async(req, res)=>{

  try{
    const {skill} = req.query
    
    if(!skill || skill.trim() ===""){
      return res.status(400).json({message :"Skill is required"})
    }
    
    const results = await Coder.find({
      $or:[
      {skills : {$regex : skill, $options : "i" }},
      {fullname : {$regex : skill, $options : "i"}}
      ]
    }).select("-password")

    
    
    res.status(200).json(results)
  }
  catch(error){
    console.log(error)
  }

})

app.post("/send-request", requireLogin, async(req,res)=>{
  

try{
  const {receiverId,teamId, message} = req.body
  const senderId = req.session.userId

  if (!teamId) {
    return res.status(400).json({ message: "No Team ID provided. Please select a team first." });
  }

  const teamExists = await Team.findById(teamId);
  if (!teamExists) {
    return res.status(404).json({ message: "Team not found." });
  }

  if(senderId==receiverId){
    return res.status(400).json({message:"You can not request yourself"})
  }

  const existingRequest = await Request.findOne({sender:senderId, receiver: receiverId, team:teamId})

  if(existingRequest){
    return res.status(400).json({message:"Request already sent"})
  }
 
  const newRequest = new Request({
    sender:senderId,
    receiver:receiverId,
    team : teamId,
    message: message || ""
  });

  await newRequest.save();
  res.status(200).json({message:"Request send successfully"})

}catch(error){

  console.log(error);
  res.status(500).json({message:"Error sending request"})
}

})


app.get("/my-requests",requireLogin, async(req,res)=>{

  try{

    const userId = req.session.userId

    const requests = await Request.find({receiver:userId, status:"pending"})
         .populate('sender' , 'fullname skills college year')
         .sort({createdAt : -1});
 
  
    res.status(200).json(requests)
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Error fetching requests"})
  }


} )

app.post("/accept-request", requireLogin, async (req, res) => {
  console.log("ACCEPT ENDPOINT HIT");
  console.log("teamId received:", req.body.teamId);
  console.log("memberId received:", req.body.memberId);
  console.log("requestID received:", req.body.requestID);

  const { teamId, memberId, requestID } = req.body;

  
  // const updatedTeam = await Team.findByIdAndUpdate(
  //   teamId,
  //   { $push: { members: memberId } }, 
  //   { new: true }
  // );

  const updatedTeam = await Team.findByIdAndUpdate(
    teamId,
    {$addToSet: {members:memberId}},
    {new: true}
  )


  await Request.findByIdAndDelete(requestID)

  console.log("UPDATED TEAM:", updatedTeam);

  res.json({
    message: "Member added to team",
    team: updatedTeam
  });
});

// app.post("/decline-request", requireLogin, async (req, res) => {
  
//     const { requestId, reason } = req.body;

//      if (!reason || !reason.trim()) {
//     return res.status(400).json({ message: "Decline reason required" });
//   }

//      const updatedRequest = await Request.findByIdAndUpdate(
//     requestId,
//     {
//       status: "rejected",
//       declineReason: reason
//     },
//     { new: true }
//   );
//   res.json({ message: "Request declined", request: updatedRequest });
// });

    app.post("/decline-request", requireLogin, async (req, res) => {
  const { requestId, reason } = req.body;

  await Request.findByIdAndUpdate(requestId, {
    status: "rejected",
    declineReason: reason || "",
  });

  res.json({ message: "Request declined" });
});

  

// app.get("/my-teams",requireLogin, async(req,res)=>{
//   try{

//     const teams = await Team.find({members:req.session.userId})
//     .populate('members','fullname')
//     .populate('admin',' _id fullname ')
//     .sort({createdAt: -1})

    

// res.status(200).json(teams)    

//   }catch(error){
//     console.log(error)
//     res.status(500).json({message:"Error fetching teams"})
//   }
// })

// app.get("/my-teams", requireLogin, async (req, res) => {
//   try {
//     const teams = await Team.find({ members: req.session.userId })
//       .populate("members", "fullname")
//       .populate("admin", "fullname");

//     const teamIds = teams.map(t => t._id);

//     const requests = await Request.find({
//       team: { $in: teamIds }
//     })
//       .populate("receiver", "fullname");

//     const teamsWithStatus = teams.map(team => {
//       const teamRequests = requests.filter(
//         r => r.team.toString() === team._id.toString()
//       );

//       const pending = teamRequests.filter(r => r.status === "pending");
//       const rejected = teamRequests
//   .filter(r => r.status === "rejected")
//   .map(r => ({
//     _id: r._id,
//     user: r.receiver
//   }));


//       return {
//         ...team.toObject(),
//         pendingMembers: pending.map(r => r.receiver),
//         rejectedMembers: rejected.map(r => r.receiver),
//       };
//     });

//     res.json(teamsWithStatus);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error fetching teams" });
//   }
// });

app.get("/my-teams", requireLogin, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.session.userId })
      .populate("members", "fullname")
      .populate("admin", "fullname");

    const teamIds = teams.map(t => t._id);

    const requests = await Request.find({
      team: { $in: teamIds }
    }).populate("receiver", "fullname");

    const teamsWithStatus = teams.map(team => {
      const teamRequests = requests.filter(
        r => r.team.toString() === team._id.toString()
      );

      const pending = teamRequests.filter(r => r.status === "pending");

      const rejected = teamRequests
        .filter(r => r.status === "rejected")
        .map(r => ({
          _id: r._id,          // request id
          user: r.receiver    // rejected user
        }));

      return {
        ...team.toObject(),
        pendingMembers: pending.map(r => r.receiver),
        rejectedMembers: rejected
      };
    });

    res.json(teamsWithStatus);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching teams" });
  }
});



app.post("/delete-team", requireLogin,async(req,res) =>{
res.send("DELETE TEAM ROUTE HIT");
try{
const {teamId} = req.body
await Team.findByIdAndDelete(teamId)
res.status(200).json({message:"Team Deleted"})
}
catch(err){
console.log(err)
res.status(500).json({message:"Error deleting team."})
}


})

app.post("/update-team-name", requireLogin, async(req,res)=>{
  try{

    const{teamId, newName}= req.body
    await Team.findByIdAndUpdate(teamId,{name:newName})
    res.status(200).json({message:"Team renamed"})
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Error updating name"})
  }
})


app.post("/create-team", requireLogin, async (req, res) => {
  console.log("CREATE TEAM ROUTE HIT");

  try{

  const {name, description} = req.body

  const team = new Team({
    name : name || "Unitiled Team",
    description :description || "",
    members: [req.session.userId],
    admin: req.session.userId
  });
  await team.save();
  res.json(team);
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Failed to create team" });
  }




});

app.get("/sent-requests", requireLogin, async (req, res) => {
  const requests = await Request.find({
    sender: req.session.userId,
    status: "rejected"
  }).populate("receiver", "fullname");

  res.json(requests);
});

app.post("/remove-rejected", requireLogin, async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID required" });
    }

    await Request.findByIdAndDelete(requestId);

    res.json({ message: "Rejected request removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to remove rejected request" });
  }
});


// app.post("/join-post", requireLogin, async (req, res) => {
//   try {
//     const { teamId, requiredSkills, message } = req.body;

//     if (!teamId || !requiredSkills || requiredSkills.length === 0) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const team = await Team.findById(teamId);

//     if (!team) {
//       return res.status(404).json({ message: "Team not found" });
//     }

    
//     if (team.admin.toString() !== req.session.userId) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const post = new JoinPost({
//       team: teamId,
//       admin: req.session.userId,
//       requiredSkills,
//       message
//     });

//     await post.save();

//     res.json({ message: "Join request posted publicly", post });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to post join request" });
//   }
// });

app.post("/join-post", requireLogin, async (req, res) => {
  try {
    const { teamId, requiredSkills, message } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    
    if (team.publicPostCreated) {
      return res.status(400).json({
        message: "This team has already been posted publicly"
      });
    }

    if (team.admin.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const post = new JoinPost({
      team: teamId,
      admin: req.session.userId,
      requiredSkills,
      message
    });

    await post.save();

    
    team.publicPostCreated = true;
    await team.save();

    res.json({ message: "Join request posted publicly", post });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to post join request" });
  }
});


// app.get("/join-posts", requireLogin, async (req, res) => {
//   try {
//     const posts = await JoinPost.find()
//        .populate({
//         path: "team",
//         select: "name description",
//         populate: {
//           path: "admin",
//           select: "fullname universityId"
//         }
//       });

//     const applications = await JoinApplication.find({
//       applicant: req.session.userId
//     });

//     const appliedPostIds = applications.map(a =>
//       a.post.toString()
//     );

//     const postsWithStatus = posts.map(post => ({
//       ...post.toObject(),
//       alreadyApplied: appliedPostIds.includes(post._id.toString())
//     }));

//     res.json(postsWithStatus);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch join posts" });
//   }
// });

app.get("/join-posts", requireLogin, async (req, res) => {
  try {
    const posts = await JoinPost.find()
      .populate({
        path: "team",
        select: "name description admin members",
        populate: [
          { path: "admin", select: "fullname" },
          { path: "members", select: "fullname" }
        ]
      });

    const applications = await JoinApplication.find({
      applicant: req.session.userId
    });

    const appliedPostIds = applications.map(a => a.post.toString());

    // fetch pending join requests per team
    const teamIds = posts.map(p => p.team._id);
    const requests = await Request.find({
      team: { $in: teamIds },
      status: "pending"
    }).populate("receiver", "fullname");

    const postsWithExtras = posts.map(post => {
      const pending = requests
        .filter(r => r.team.toString() === post.team._id.toString())
        .map(r => r.receiver);

      return {
        ...post.toObject(),
        alreadyApplied: appliedPostIds.includes(post._id.toString()),
        pendingMembers: pending
      };
    });

    res.json(postsWithExtras);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch join posts" });
  }
});



app.post("/apply-join", requireLogin, async (req, res) => {
  try {
    const { postId, selectedSkill, message } = req.body;

    const existing = await JoinApplication.findOne({
      post: postId,
      applicant: req.session.userId
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new JoinApplication({
      post: postId,
      applicant: req.session.userId,
      selectedSkill,
      message
    });

    await application.save();

    res.json({ message: "Application sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to apply" });
  }
});

// app.get("/join-applications", requireLogin, async (req, res) => {
//   const apps = await JoinApplication.find({ status: "pending" })
//     .populate("applicant", "fullname")
//     .populate({
//       path: "post",
//       populate: { path: "team", select: "name" }
//     });

//   res.json(apps);
// });

app.get("/join-applications", requireLogin, async (req, res) => {
  try {
    const applications = await JoinApplication.find({ status: "pending" })
      .populate("applicant", "fullname")
      .populate({
        path: "post",
        populate: {
          path: "team",
          select: "name admin"
        }
      });

    // Only applications for teams where current user is admin
    const filtered = applications.filter(
      app => app.post.team.admin.toString() === req.session.userId
    );

    res.json(filtered);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch join applications" });
  }
});

app.post("/accept-join", requireLogin, async (req, res) => {
  try {
    const { applicationId } = req.body;

    const application = await JoinApplication.findById(applicationId)
      .populate({
        path: "post",
        populate: { path: "team" }
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only team admin can accept
    if (application.post.team.admin.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Add member to team
    await Team.findByIdAndUpdate(
      application.post.team._id,
      { $addToSet: { members: application.applicant } }
    );

    application.status = "accepted";
    await application.save();

    res.json({ message: "Applicant added to team" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept application" });
  }
});


// app.post("/reject-join", requireLogin, async (req, res) => {
//   try {
//     const { applicationId } = req.body;

//     const application = await JoinApplication.findById(applicationId)
//       .populate({
//         path: "post",
//         populate: { path: "team" }
//       });

//     if (!application) {
//       return res.status(404).json({ message: "Application not found" });
//     }

    
//     if (application.post.team.admin.toString() !== req.session.userId) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     application.status = "rejected";
//     await application.save();

//     res.json({ message: "Application rejected" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to reject application" });
//   }
// });

app.post("/reject-join", requireLogin, async (req, res) => {
  try {
    const { applicationId, reason } = req.body;

    const application = await JoinApplication.findById(applicationId)
      .populate({
        path: "post",
        populate: { path: "team" }
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.post.team.admin.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = "rejected";
    application.declineReason = reason || "";

    await application.save();

    res.json({ message: "Application rejected with reason" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject application" });
  }
});
app.get("/my-join-rejections", requireLogin, async (req, res) => {
  const apps = await JoinApplication.find({
    applicant: req.session.userId,
    status: "rejected"
  })
    .populate({
      path: "post",
      populate: {
        path: "team",
        select: "name"
      }
    })
    .sort({ createdAt: -1 });

  res.json(apps);
});

app.post("/delete-join-rejection", requireLogin, async (req, res) => {
  const { applicationId } = req.body;

  const app = await JoinApplication.findOne({
    _id: applicationId,
    applicant: req.session.userId,
    status: "rejected"
  });

  if (!app) {
    return res.status(404).json({ message: "Not found" });
  }

  await app.deleteOne();

  res.json({ message: "Rejected application deleted" });
});

app.post("/update-profile", requireLogin, async (req, res) => {
  try {
    const updates = req.body;

    const user = await Coder.findByIdAndUpdate(
      req.session.userId,
      updates,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

app.get("/users/:userId", requireLogin, async (req, res) => {
  try {
    const user = await Coder.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

app.post("/delete-join-post", requireLogin, async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await JoinPost.findById(postId).populate("team");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔐 Only admin can delete
    if (post.team.admin.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // allow posting again in future
    await Team.findByIdAndUpdate(post.team._id, {
      publicPostCreated: false
    });

    await JoinApplication.deleteMany({ post: postId });
    await post.deleteOne();

    res.json({ message: "Join post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete join post" });
  }
});









import { createServer } from 'http'
import { Server } from "socket.io"

const httpServer = createServer(app)

const io = new Server(httpServer,{
  cors:{
    origin: "http://localhost:5173",
    credentials: true
  }
})

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

 socket.on("join-team",({teamId})=>{
 socket.join(teamId);
 console.log(`👥 Socket ${socket.id} joined team ${teamId}`);
 
 })

   socket.on("send-message", async (data) => {
    try {
      const { teamId, message, senderId, senderName } = data;

      // 1️⃣ Save message to DB
      const chat = new ChatMessage({
        team: teamId,
        sender: senderId,
        senderName,
        message,
      });

      await chat.save();

      // 2️⃣ Broadcast to team room
      io.to(teamId).emit("receive-message", {
        sender: senderName,
        message,
        createdAt: chat.createdAt,
      });
    } catch (err) {
      console.error("Chat save error:", err);
    }
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(` Server running on port ${port}`);
});

app.get("/team/:teamId/messages", requireLogin, async (req, res) => {
  const { teamId } = req.params;

  const messages = await ChatMessage.find({ team: teamId })
    .sort({ createdAt: 1 });

  res.json(messages);
});