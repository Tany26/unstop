const router = require("express").Router();
const Seat = require("../DB/model/model");

// API endpoint to reserve seats
router.post("/reserveSeats", async (req, res) => {
  const { numSeats } = req.body;
  // check if nums seats greater then 7 or not
  if (numSeats > 7)
    res.status(200).send({
      message:
        "No. of seats can be reserved at one time from User is less than equal to 7",
    });

  try {
    // find all unreserved seat in sorted order
    const availableSeats = await Seat.find({ isReserved: false }).sort(
      "row number"
    );

    // reserved seats aarray
    const reservedSeats = [];

    // treverse each seat row
    for (let i = 0; i < availableSeats.length; i++) {
      const currentSeat = availableSeats[i];
      const consecutiveSeats = [currentSeat];

      for (let j = 1; j < numSeats; j++) {
        const nextSeat = availableSeats.find(
          (seat) =>
            seat.row === currentSeat.row &&
            seat.number === currentSeat.number + j
        );

        if (!nextSeat || nextSeat.isReserved) {
          // Break if the next seat is not available or already reserved
          break;
        }

        consecutiveSeats.push(nextSeat);
      }

      if (consecutiveSeats.length === numSeats) {
        // Found consecutive seats in the same row
        reservedSeats.push(...consecutiveSeats);
        break;
      }
    }

    // if not find consicutive seats
    if (reservedSeats.length < numSeats) {
      // If consecutive seats in the same row are not available, reserve nearby seats
      for (let i = 0; i < availableSeats.length; i++) {
        // check nearby seats
        const nearbySeat = availableSeats[i];

        if (!nearbySeat.isReserved) {
          reservedSeats.push(nearbySeat);

          if (reservedSeats.length === numSeats) {
            break;
          }
        }
      }
    }

    if (reservedSeats.length < numSeats) {
      return res.status(400).json({ error: "Not enough seats available." });
    }

    const seatNumbers = reservedSeats.map((seat) => seat.number);
    const rowNumber = reservedSeats.map((seat) => seat.row);

    // Update seats as reserved
    await Seat.updateMany(
      { _id: { $in: reservedSeats.map((seat) => seat._id) } },
      { isReserved: true }
    );

    res.json({ seatNumbers, rowNumber });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
