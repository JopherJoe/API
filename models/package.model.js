const mongoose = require('mysql2');

const packageSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    no_of_pax: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
    },
    add_ons: {
        type: String,
        required: true,
      },
    price: {
        type: Number,
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const Package = mysql2.model('Package', packageSchema);

module.exports = Package;