import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'

const TheatreNowShowing = () => {
  const { axios } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/theatres/now-showing/all')
        if (data.success) setMovies(data.movies || [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [axios])

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Now Showing (Theatres)</h1>
        <button className='text-sm text-gray-300 hover:underline' onClick={() => navigate('/theaters')}>All Theatres</button>
      </div>

      {loading ? (
        <p className='text-gray-300 mt-6'>Loading...</p>
      ) : (
        <div className='space-y-8 mt-6'>
          {movies.map((m) => (
            <div key={m.movie._id}>
              <div className='flex items-center gap-6 flex-wrap'>
                <MovieCard movie={m.movie} />
                <div className='flex-1 min-w-60'>
                  <p className='text-sm text-gray-300 mb-2'>Playing at</p>
                  <div className='flex flex-wrap gap-2'>
                    {m.theatres.map((t) => (
                      <button key={t._id} className='px-3 py-1 bg-gray-800 rounded-full text-xs hover:bg-gray-700' onClick={() => navigate(`/theaters/${t._id}`)}>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TheatreNowShowing
