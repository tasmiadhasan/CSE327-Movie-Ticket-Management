import express from "express";
import { getFavorites, getUserBookings, updateFavorite, subscribeNotify, unsubscribeNotify, listNotify } from "../controllers/userController.js";


const userRouter = express.Router();


userRouter.get('/bookings', getUserBookings)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites', getFavorites)
// Notify endpoints
userRouter.post('/notify', subscribeNotify)
userRouter.delete('/notify/:movieId', unsubscribeNotify)
userRouter.get('/notify', listNotify)


export default userRouter;