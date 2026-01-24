import mongoose from "mongoose";

const CoderDataSchema = new mongoose.Schema({
    fullname : {type : String, required: true},
    bio : {type : String, default : ""},
    universityId : {type: String, required : true, unique : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    skills : {type : String},
    college : {type : String, required : true},
    course : {type:String, required : true},
    year : {type: Number, required : true },
})

export const Coder = mongoose.model("Coder", CoderDataSchema)