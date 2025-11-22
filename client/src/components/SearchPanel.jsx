import React, { useEffect, useMemo, useRef, useState } from 'react'
import { XIcon, SearchIcon } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const ResultRow = ({ movie, onClick }) => {
  const { image_base_url } = useAppContext()
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-md cursor-pointer text-left'
    >
      <img
        src={image_base_url + (movie.poster_path || movie.backdrop_path)}
        alt={movie.title}
        className='h-10 w-7 object-cover rounded-sm bg-gray-700'
      />
      <div className='flex-1 min-w-0'>
        <p className='truncate text-sm'>{movie.title}</p>
        <p className='text-xs text-gray-400 truncate'>
          {(movie.release_date || '').split('-')[0] || '—'} • {Array.isArray(movie.genres) ? movie.genres.slice(0,2).map(g => g.name).join(' | ') : ''}
        </p>
      </div>
    </button>
  )
}

const SearchPanel = ({ open, onClose }) => {
  const navigate = useNavigate()
  const { shows } = useAppContext()
  const [q, setQ] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return shows.slice(0, 8)
    return shows.filter(m => m.title?.toLowerCase().includes(term)).slice(0, 8)
  }, [q, shows])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[60] flex items-start justify-center pt-28 bg-black/60 backdrop-blur-sm'>
      <div className='w-full max-w-xl mx-4 rounded-2xl border border-gray-700 bg-[#0e0e11] shadow-xl'>
        <div className='flex items-center gap-2 px-4 py-3 border-b border-gray-800'>
          <SearchIcon size={18} className='text-gray-400' />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search movies'
            className='flex-1 bg-transparent outline-none text-sm'
          />
          <XIcon size={18} className='cursor-pointer text-gray-400 hover:text-gray-200' onClick={onClose} />
        </div>
        <div className='max-h-96 overflow-auto p-2'>
          {results.length === 0 ? (
            <p className='text-sm text-gray-400 px-3 py-6'>No matches. Try another title or check Releases.</p>
          ) : (
            results.map((movie) => (
              <ResultRow
                key={movie._id}
                movie={movie}
                onClick={() => {
                  onClose?.()
                  navigate(`/movies/${movie._id}`)
                  scrollTo(0, 0)
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPanel
