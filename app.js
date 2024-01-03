const express = require("express");
const connectDB = require("./DB/config/connection");
const Seat = require("./DB/model/model");
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
// Function to initialize seats in the database

const initializeSeats = async () => {
  for (let row = 1; row <= 12; row++) {
    const totalSeatsInRow = row === 12 ? 3 : 7;
    for (let seatNum = 1; seatNum <= totalSeatsInRow; seatNum++) {
      await Seat.create({
        number: seatNum,
        row,
        isReserved: false,
      });
    }
  }
};

initializeSeats();

app.use("/", require("./route/seat"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
