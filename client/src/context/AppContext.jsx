/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext , useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
const [shows, setShows] = useState([])
const [favoriteMovies, setFavoriteMovies] = useState([])

const image_base_url= import.meta.env.VITE_TMDB_IMAGE_BASE_URL

const{user}=useUser()
const {getToken}= useAuth()

const location= useLocation()
const navigate= useNavigate()

const fetchIsAdmin = useCallback(async ()=>{
  try {
    const {data} = await axios.get('/api/admin/is-admin', {headers:
{Authorization: `Bearer ${await getToken()}`}})
    setIsAdmin(data.isAdmin)
    if(!data.isAdmin && location.pathname.startsWith('/admin')){
      navigate('/')
      toast.error("You are not authorized to access admin panel")
    }
  } catch (error) {
    console.error(error)
  }
}, [getToken, location.pathname, navigate])

  const fetchShows = async ()=>{
  try {
    const { data } = await axios.get('/api/shows/all')
    if(data.success){
      setShows(data.shows)
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error)
  }
}


const fetchFavoriteMovies = useCallback(async ()=>{
  try {
    const { data } = await axios.get('/api/user/favorites', {headers: 
{Authorization: `Bearer ${await getToken()}`}})


    if(data.success){
      setFavoriteMovies(data.movies)
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error)
  }
}, [getToken])


   

  useEffect(() => {
    fetchShows()
  }, [])


   useEffect(() => {
    if(user){
      fetchIsAdmin()
      fetchFavoriteMovies()
    }
    }, [user, fetchIsAdmin, fetchFavoriteMovies])
   

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url


  }
  return (
    <AppContext.Provider value={value}>
      { children }
    </AppContext.Provider>
  )
}

export const useAppContext = ()=> useContext(AppContext)