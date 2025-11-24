
import Show from "../models/show.js"
import Booking from "../models/booking.js"
import Stripe from "stripe";
import { inngest } from "../inngest/index.js";


// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats)=>{
  try {

    const showData = await Show.findById(showId)
    if(!showData) return false;


    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }

}

export const createBooking = async (req, res)=>{
  try {

  // extract user id safely from common middleware shapes
  const userId = (req?.auth?.userId) ?? (req?.user?.id) ?? (req?.user?._id) ?? null;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {showId, selectedSeats} = req.body;
    const { origin } = req.headers;

    if(!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking data' });
    }

    // Check if the seat is available for the selected show
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats)
    if(!isAvailable){
      return res.json({success: false, message: "Selected seats are not available."})
    } 


    // Get the show details
    const showData = await Show.findById(showId).populate('movie');
    if(!showData) return res.status(404).json({ success: false, message: 'Show not found' });

    // Create a new booking
    const amount = (typeof showData.showPrice === 'number') ? showData.showPrice * selectedSeats.length : 0;
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      bookedSeats: selectedSeats
    })


    showData.occupiedSeats = showData.occupiedSeats || {};
    selectedSeats.forEach((seat)=>{
      showData.occupiedSeats[seat] = userId;
    })

    showData.markModified('occupiedSeats');

    await showData.save();

    const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items=[
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: showData.movie.title,
          },
          unit_amount: Math.floor(booking.amount * 100)
        },
        quantity: 1
      }
    ];


const session = await stripeInstance.checkout.sessions.create({
    success_url: `${origin}/loading/my-bookings`,
    cancel_url: `${origin}/my-bookings`,
    line_items: line_items,
    mode: 'payment',
    metadata: {
        bookingId: booking._id.toString()
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
})
        booking.paymentLink=session.url;
        await booking.save();
         await inngest.send({
    name: "app/checkpayment",
    data: {
        bookingId: booking._id.toString()
    }
       })



    return res.json({ success: true, url: session.url });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: error.message})
  }
}

export const getOccupiedSeats = async (req, res)=>{
  try {

    const {showId} = req.params;
    const showData = await Show.findById(showId)
    if(!showData) return res.status(404).json({ success: false, message: 'Show not found' });

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    res.json({success: true, occupiedSeats})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: error.message})
  }
}

