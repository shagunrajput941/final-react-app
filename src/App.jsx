import{useEffect, useState } from 'react'
import React from 'react'
import heroImg from './assets/Section.png'
import MovieCard from './components/MovieCard';

import Spinner from './components/Spinner';

import Search from './components/Search.jsx'
const API_BASE_URL='https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS={
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`bearer ${API_KEY}`
  }
}



const App = () => {
  const[searchTerm,setSearchTerm]=useState('');
  const[errorMessage , setErrorMessage]=useState('');
  const[movieList,setMovieList]=useState([]);
  const[isLoading,setIsLoading]=useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

 const fetchMovies = async(query ='')=>{
   console.log("API KEY =", API_KEY);
  console.log("Fetching query =", query);
  setIsLoading(true);
  setErrorMessage('');
  try{
    const endpoint = query
  ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
  : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint,API_OPTIONS);
    // alert(response.status);
     if (!response.ok){
      throw new Error('Failed to fetch movies');

     }
    const data = await response.json();
console.log("DATA =", data);
       
   
    setMovieList(data.results || []);



    



  } catch(error){
    console.error(`Error fetching movies: ${error}`);
    setErrorMessage('Error fetching movies.please try again later');
  } finally {
    setIsLoading(false);
  }

 }
 useEffect(() =>{
  fetchMovies(debouncedSearchTerm);


 },[debouncedSearchTerm])


  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src={heroImg} alt="hero Banner"></img>
          <h1>Find <span className="text-gradient">Movies</span> You'll enjoy without the Hassle </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'> All Movies</h2>
          {isLoading ? (
            <Spinner/>
          ):errorMessage ?(
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
           {movieList.map((movie) => (
           <MovieCard key={movie.id} movie={movie} />
  ))}
</ul>
            
   
          )}

        </section>
        <h1 className='text-white'>{searchTerm}</h1>

        </div>
        

     
    </main>
  )
}

export default App

