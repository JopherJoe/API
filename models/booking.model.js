const mongoose = require('mysql2');

const bookingSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact_no: {
      type: Number,
      required: true,
    },
    departure_date: {
        type: Number,
        required: true,
      },
      return_date: {
        type: Number,
        required: true,
      },
      no_of_pax_adults: {
        type: Number,
        required: true,
      },
      no_of_pax_kids: {
          type: Number,
          required: true,
        },
        total_of_bills: {
          type: Number,
          required: true,
        },
  },
  {
    timestamps: true,
  }
);

const Booking = mysql2.model('Booking', bookingSchema);

module.exports = Booking;