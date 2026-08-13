import { useEffect, useState } from "react"
import { SearchBarContainer, SearchInput, SearchButton } from "./SearchBar.styles";


const SearchBar=({setQuery})=>{

    return (
        <SearchBarContainer>
        <SearchInput 
            type="text" 
            placeholder="Buscar..." 
            onChange={(e) => setQuery(e.target.value)} 
        />
        <SearchButton type="button">
            <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        </SearchButton>
        </SearchBarContainer>
    );
}

export default SearchBar