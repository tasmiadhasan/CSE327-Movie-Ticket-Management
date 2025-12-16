import React, { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Theaters = () => {
  const { axios } = useAppContext()
  const navigate = useNavigate()
  const [theatres, setTheatres] = useState([])
  const [city, setCity] = useState('All')
  const [loading, setLoading] = useState(false)
  const [nowShowing, setNowShowing] = useState([])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const [withShowsRes, nowShowingRes] = await Promise.all([
          axios.get('/api/theatres/with-shows'),
          axios.get('/api/theatres/now-showing/all'),
        ])
        if (withShowsRes.data?.success) setTheatres(withShowsRes.data.theatres || [])
        if (nowShowingRes.data?.success) setNowShowing(nowShowingRes.data.movies || [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [axios])

  const cities = useMemo(() => ['All', ...Array.from(new Set(theatres.map((t) => t.theatre.city).values()))], [theatres])
  const filtered = useMemo(() => theatres.filter((t) => (city === 'All' ? true : t.theatre.city === city)), [theatres, city])

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden'>
      <BlurCircle top='150px' left='0px' />
      <BlurCircle bottom='150px' right='50px' />

      <h1 className='text-lg font-medium my-4'>Theaters</h1>

      {/* Now Showing movies across theatres */}
      {nowShowing.length > 0 && (
        <div className='mb-10'>
          <p className='text-lg font-semibold'>Now Showing</p>
          <div className='flex flex-wrap gap-6 mt-4'>
            {nowShowing.map((m) => (
              <MovieCard key={m.movie._id} movie={m.movie} />
            ))}
          </div>
        </div>
      )}

      <div className='flex items-center gap-3 mb-6'>
        <label className='text-sm text-gray-300'>City</label>
        <select className='bg-gray-800 rounded px-3 py-2 text-sm outline-none' value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className='text-xs text-gray-400'>Showing upcoming showtimes per theatre</span>
      </div>

      {loading ? (
        <p className='text-gray-300'>Loading...</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {filtered.map((t) => {
            // Group shows by movie for this theatre
            const movieMap = new Map()
            for (const s of t.shows) {
              if (!s.movie) continue
              const key = s.movie._id
              const entry = movieMap.get(key) || { movie: s.movie, times: [] }
              entry.times.push(new Date(s.time))
              movieMap.set(key, entry)
            }
            const movies = Array.from(movieMap.values())

            return (
              <div key={t.theatre._id} className='rounded-xl bg-gray-800 p-4'>
                <p className='font-semibold'>
                  <button className='hover:underline' onClick={() => navigate(`/theaters/${t.theatre._id}`)}>{t.theatre.name}</button>
                </p>
                <p className='text-sm text-gray-400'>{t.theatre.city}</p>
                {t.theatre.amenities?.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {t.theatre.amenities.map((a) => (
                      <span key={a} className='text-xs px-2 py-1 bg-gray-700 rounded-full'>
                        {a}
                      </span>
                    ))}
                  </div>
                )}
                <div className='mt-4 space-y-4'>
                  {movies.map(({ movie, times }) => (
                    <div key={movie._id}>
                      <p className='text-sm font-medium mb-2'>{movie.title}</p>
                      <div className='flex flex-wrap gap-2'>
                        {times.map((dt, idx) => {
                          const dateStr = dt.toISOString().split('T')[0]
                          const label = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          return (
                            <button
                              key={movie._id + '-' + idx}
                              onClick={() => navigate(`/movies/${movie._id}/${dateStr}`)}
                              className='px-3 py-1 rounded bg-gray-700 text-xs cursor-pointer hover:bg-gray-600'
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Theaters
