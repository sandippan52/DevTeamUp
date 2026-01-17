import mongoose from "mongoose";

const CoderDataSchema = new mongoose.Schema({
    fullname : {type : String, required: true, unique : true},
    bio : {type : String, default : ""},
    universityId : {type: String},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    skills : {type : String},
    college : {type : String},
    course : {type:String},
    year : {type: Number},
})

export const Coder = mongoose.model("Coder", CoderDataSchema)