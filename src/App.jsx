import React, { useEffect, useState } from 'react';
import heroImg from './assets/hero-img (1).png';
import sectionImg from './assets/section.png';

import MovieCard from './components/MovieCard';
import Spinner from './components/Spinner';
import Search from './components/Search';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // .env.local me yehi naam hona chahiye

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // fetch all/search movies
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // fetch trending movies
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending/movie/day`,
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error('Failed to fetch trending movies');
      }

      const data = await response.json();
      setTrendingMovies(data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src={heroImg} alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Trending Section - Search bar ke niche */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <div className="flex items-center justify-between mb-6">
              <h2>Trending Movies</h2>
              <img
                src={sectionImg}
                alt="Trending section"
                className="w-28 sm:w-36 object-contain"
              />
            </div>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>

                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/no-movie.png'
                    }
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* All Movies */}
        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

