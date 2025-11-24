import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard'

const TheatreDetails = () => {
  const { id } = useParams()
  const { axios } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/theatres/${id}/movies`)
        if (data.success) setMovies(data.movies || [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [axios, id])

  const flatMovies = useMemo(() => movies.map((m) => m.movie), [movies])

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Theatre Movies</h1>
        <button className='text-sm text-gray-300 hover:underline' onClick={() => navigate('/theaters')}>Back to Theatres</button>
      </div>

      {loading ? (
        <p className='text-gray-300 mt-6'>Loading...</p>
      ) : (
        <>
          <p className='text-sm text-gray-400 mt-2'>Movies currently running here</p>
          <div className='flex flex-wrap gap-6 mt-6'>
            {flatMovies.map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
          </div>

          {/* Optional: showtime chips per movie */}
          <div className='mt-10 space-y-6'>
            {movies.map(({ movie, times }) => (
              <div key={movie._id}>
                <p className='text-sm font-medium mb-2'>{movie.title} showtimes</p>
                <div className='flex flex-wrap gap-2'>
                  {times.map((t, idx) => {
                    const dt = new Date(t)
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
        </>
      )}
    </div>
  )
}

export default TheatreDetails
