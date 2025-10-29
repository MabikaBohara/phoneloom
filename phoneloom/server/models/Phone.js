const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  storage: [{
    type: String,
    required: false,
    default: []
  }],
  colors: [{
    type: String,
    required: false,
    default: []
  }],
  batterySize: {
    type: String,
    required: false,
    default: ''
  },
  batteryType: {
    type: String,
    required: false,
    default: ''
  },
  ramSize: [{
    type: String,
    required: false,
    default: []
  }],
  displaySize: {
    type: String,
    required: false,
    default: ''
  },
  releaseDate: {
    type: Date,
    required: false,
    default: Date.now
  },
  image: {
    type: String,
    required: true

  },
  frontCamera: {
    type: String,
    required: false,
    default: ''
  },
  backCamera: {
    type: String,
    required: false,
    default: ''
  },
  os: {
    type: String,
    required: false,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model('Phone', phoneSchema, 'phones');




