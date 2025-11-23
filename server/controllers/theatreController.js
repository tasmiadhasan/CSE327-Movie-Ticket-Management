import Show from "../models/show.js";

export const getTheatresWithUpcomingShows = async (req, res) => {
  try {
    const now = new Date();
    const shows = await Show.find({ showDateTime: { $gte: now } })
      .populate('movie')
      .populate('theatre')
      .sort({ showDateTime: 1 })
      .lean();

    const group = new Map();
    for (const s of shows) {
      const key = s.theatre?._id || 'unknown';
      const theatreInfo = s.theatre || { _id: 'unknown', name: 'All Cinemas', city: '—', amenities: [] };
      if (!group.has(key)) group.set(key, { theatre: theatreInfo, shows: [] });
      group.get(key).shows.push({
        id: String(s._id),
        time: s.showDateTime,
        price: s.showPrice,
        movie: s.movie ? { _id: s.movie._id, title: s.movie.title } : null,
      });
    }

    const theatres = Array.from(group.values());
    res.json({ success: true, theatres });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

export const getMoviesRunningInTheatre = async (req, res) => {
  try {
    const { theatreId } = req.params;
    const now = new Date();

    const baseFilter = { showDateTime: { $gte: now } };
    const filter =
      theatreId === 'unknown'
        ? { ...baseFilter, $or: [{ theatre: { $exists: false } }, { theatre: null }, { theatre: '' }] }
        : { ...baseFilter, theatre: theatreId };

    const shows = await Show.find(filter)
      .populate('movie')
      .sort({ showDateTime: 1 })
      .lean();

    const movieMap = new Map();
    for (const s of shows) {
      if (!s.movie) continue;
      const mId = s.movie._id;
      const entry = movieMap.get(mId) || { movie: s.movie, times: [] };
      entry.times.push(s.showDateTime);
      movieMap.set(mId, entry);
    }

    const movies = Array.from(movieMap.values());
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

export const getNowShowingAcrossTheatres = async (req, res) => {
  try {
    const now = new Date();
    const shows = await Show.find({ showDateTime: { $gte: now } })
      .populate('movie')
      .populate('theatre')
      .sort({ showDateTime: 1 })
      .lean();

    const movieMap = new Map();
    for (const s of shows) {
      if (!s.movie) continue;
      const mId = s.movie._id;
      const entry = movieMap.get(mId) || { movie: s.movie, theatres: new Map(), times: [] };
      const th = s.theatre || { _id: 'unknown', name: 'All Cinemas' };
      entry.theatres.set(th._id, th);
      entry.times.push(s.showDateTime);
      movieMap.set(mId, entry);
    }

    const payload = Array.from(movieMap.values()).map((e) => ({
      movie: e.movie,
      theatres: Array.from(e.theatres.values()),
      times: e.times,
    }));

    res.json({ success: true, movies: payload });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}
