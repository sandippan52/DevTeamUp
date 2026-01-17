import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        default : "Untitled Team"
    },

    description :{
        type : String, 
        default : ""
    },

    members : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Coder"
    }],
    admin :{
        type: mongoose.Schema.Types.ObjectId,
        ref :'Coder'
    },
    
    publicPostCreated: {
        type: Boolean,
        default: false
    },

    createdAt :{
        type: Date,
        default : Date.now
    }
})

export const Team = mongoose.model("Team",TeamSchema)