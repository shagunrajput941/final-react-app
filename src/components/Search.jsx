import React from 'react'
import searchIcon  from '../assets/vector (1).svg'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src={searchIcon} alt="search"/>
        <input
        type="text"
        placeholder="search through thousand of movies "
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        />
        
      </div>
    </div>
  )
}

export default Search
 