import Booking from "../models/booking.js";
import Movie from "../models/movie.js";
import { clerkClient } from "@clerk/express";
import Notify from "../models/notify.js";


// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res)=>{
  try {

  const user = req.auth().userId;


    const bookings = await Booking.find({user}).populate({
      path: "show",
      populate: {path: "movie"}
    }).sort({createdAt: -1 })
    res.json({success: true, bookings})
  } catch (error) {
    console.error(error.message);
    res.json({success: false, message: error.message});
  }
}


 export const updateFavorite = async (req, res)=>{
  try {

    const { movieId } = req.body;
    const userId = req.auth().userId;


  const user = await clerkClient.users.getUser(userId)

    if(!user.privateMetadata.favorites){
      user.privateMetadata.favorites = []
    }

    if(!user.privateMetadata.favorites.includes(movieId)){
      user.privateMetadata.favorites.push(movieId)
    }else{
  user.privateMetadata.favorites = user.privateMetadata.favorites.filter
(item => item !== movieId)
}


await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.
privateMetadata})

res.json({success: true, message: "Favorite movies updated"})
} catch (error) {
    console.error(error.message);
    res.json({success: false, message: error.message});
    }
}


export const getFavorites = async (req, res) =>{
  try {
  const user = await clerkClient.users.getUser(req.auth().userId)
    const favorites = user.privateMetadata.favorites;

    // Getting movies from database
    const movies = await Movie.find({_id: {$in: favorites}})

    res.json({success: true, movies})
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}

// Subscribe current user to notifications for a movie
export const subscribeNotify = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ success: false, message: 'movieId required' })

    await Notify.updateOne({ userId, movieId }, { $setOnInsert: { userId, movieId } }, { upsert: true })
    return res.json({ success: true, message: 'You will be notified when tickets open.' })
  } catch (error) {
    console.error(error.message)
    res.json({ success: false, message: error.message })
  }
}

// Unsubscribe current user for a movie
export const unsubscribeNotify = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { movieId } = req.params;
    await Notify.deleteOne({ userId, movieId })
    return res.json({ success: true, message: 'Notifications turned off.' })
  } catch (error) {
    console.error(error.message)
    res.json({ success: false, message: error.message })
  }
}

// List current user subscriptions
export const listNotify = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const subs = await Notify.find({ userId }).lean()
    res.json({ success: true, subscriptions: subs })
  } catch (error) {
    console.error(error.message)
    res.json({ success: false, message: error.message })
  }
}
