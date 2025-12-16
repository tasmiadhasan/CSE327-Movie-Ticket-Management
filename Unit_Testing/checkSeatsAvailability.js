// Extracted function from bookingController.js for unit testing
// This is a pure copy of the checkSeatsAvailability function

/**
 * Function to check availability of selected seats for a movie show
 * @param {Object} Show - The Show model/mock object
 * @param {String} showId - The ID of the show
 * @param {Array} selectedSeats - Array of seat identifiers
 * @returns {Boolean} - Returns true if all seats are available, false otherwise
 */
export const checkSeatsAvailability = async (Show, showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
