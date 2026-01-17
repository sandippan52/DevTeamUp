


import mongoose from "mongoose";
const RequestSchema = new mongoose.Schema({

sender :{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Coder',
    required: true
},

receiver :{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Coder',
    required: true
},
team:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Team",
    required: true
},

message: {
    type: String,
    default: ""
  },


status:{
    type : String,
    enum:['pending', 'accepted', 'rejected'],
    default:'pending'
},

declineReason: {
    type: String,
    default: ""
  },

  seenBySender: {
    type: Boolean,
    default: false
  },

createdAt :{
    type : Date,
    default : Date.now
}

})


export const Request = mongoose.model("Request",RequestSchema)