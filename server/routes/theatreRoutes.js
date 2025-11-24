import express from "express";
import { getTheatresWithUpcomingShows, getMoviesRunningInTheatre, getNowShowingAcrossTheatres } from "../controllers/theatreController.js";

const theatreRouter = express.Router();

theatreRouter.get('/with-shows', getTheatresWithUpcomingShows)
theatreRouter.get('/:theatreId/movies', getMoviesRunningInTheatre)
theatreRouter.get('/now-showing/all', getNowShowingAcrossTheatres)

export default theatreRouter;
