import React from 'react'
import { StarIcon, BellIcon, ExternalLink } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const ReleaseCard = ({ movie, onNotify }) => {
  const { image_base_url } = useAppContext()
  const img = movie.poster_path || movie.backdrop_path

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-60'>
      {img ? (
        <img src={image_base_url + img} alt={movie.title} className='rounded-lg h-52 w-full object-cover object-center' />
      ) : (
        <div className='rounded-lg h-52 w-full bg-gray-700' />
      )}

      <p className='font-semibold mt-2 truncate'>{movie.title}</p>
      <p className='text-sm text-gray-400 mt-2'>{movie.release_date || 'TBA'}</p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          onClick={onNotify}
          className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
        >
          Notify Me
        </button>

        {typeof movie.vote_average === 'number' ? (
          <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
            <StarIcon className='w-4 h-4 text-primary fill-primary' />
            {movie.vote_average.toFixed(1)}
          </p>
        ) : (
          <a
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target='_blank'
            rel='noreferrer'
            className='text-gray-300 text-xs inline-flex items-center gap-1 hover:underline'
          >
            TMDB <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

export default ReleaseCard
