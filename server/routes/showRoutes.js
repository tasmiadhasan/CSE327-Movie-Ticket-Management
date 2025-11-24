import express from "express";
import { getNowPlayingMovies, getUpcomingMovies, addShow, getShows, getShow } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

// Admin-only: Now playing for adding shows
showRouter.get('/now-playing',protectAdmin, getNowPlayingMovies)
// Public: Now playing and upcoming for Releases page
showRouter.get('/now-playing-public', getNowPlayingMovies)
showRouter.get('/upcoming', getUpcomingMovies)
showRouter.post('/add',protectAdmin, addShow)
showRouter.get('/all', getShows)
showRouter.get('/:movieId', getShow)



export default showRouter;