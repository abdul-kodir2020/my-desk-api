const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cvSchema = new Schema({
  name: { 
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true 
  
  },
  phone: {
    type: String,
    required: true 
  },
  address: { 
    type: String, 
    default: null
  },
  summary: { 
    type: String,
    default: null
  },
  picture: {
    type: String,
    default: null
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    type: [{
      jobTitle: { type: String, required: true },
      company: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String },
      description: { type: String }
    }],
    default: []
  },
  education: {
    type: [{
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String },
      startDate: { type: String },
      endDate: { type: String }
    }],
    default: []
  },
  certifications: {
    type: [{
      title: { type: String },
      institution: { type: String },
      dateObtained: { type: String }
    }],
    default: []
  },
  languages: [{
    language: { 
      type: String,
      default: null
    },
  }],
  visible: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String, 
    required: true 
  }
}, 
{ 
  timestamps: true 
});

module.exports = mongoose.model('CV', cvSchema);