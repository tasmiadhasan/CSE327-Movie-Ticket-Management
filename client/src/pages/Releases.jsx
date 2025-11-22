import React, { useEffect, useState } from 'react'
import ReleaseCard from '../components/ReleaseCard'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import BlurCircle from '../components/BlurCircle'

const Releases = () => {
  const { axios, getToken, user } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [upcoming, setUpcoming] = useState([])

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/shows/upcoming')
        if (data.success) setUpcoming(data.movies || [])
      } catch {
        // swallow fetch errors; UI remains empty state
      } finally {
        setLoading(false)
      }
    }
    fetchUpcoming()
  }, [axios])

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden'>
      <BlurCircle top='150px' left='0px' />
      <BlurCircle bottom='150px' right='50px' />

      <h1 className='text-lg font-medium my-4'>Upcoming Releases</h1>

      {loading ? (
        <p className='text-gray-300'>Loading...</p>
      ) : (
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {upcoming.map((m) => (
            <ReleaseCard
              key={m.id}
              movie={m}
              onNotify={async () => {
                try {
                  if (!user) return toast.error('Please login to enable notifications');
                  const { data } = await axios.post(
                    '/api/user/notify',
                    { movieId: String(m.id) },
                    { headers: { Authorization: `Bearer ${await getToken()}` } }
                  )
                  if (data.success) toast.success(data.message)
                  else toast.error(data.message)
                } catch {
                  toast.error('Could not subscribe. Try again later.')
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Releases
