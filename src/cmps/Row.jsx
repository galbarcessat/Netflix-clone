import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SET_SELECTED_MOVIE } from "../store/reducers/movie.reducer"

export function Row({ title, fetchUrl, isLargeRow = false }) {
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(fetchUrl)
            setMovies(res.data.results)
            return res
        }

        fetchData()
    }, [fetchUrl])

    function onSelectedMovie(movie) {
        dispatch({ type: SET_SELECTED_MOVIE, selectedMovie: movie })
        navigate('/movie')
    }

    return (
        <div className="row-container">
            <h2>{title}</h2>

            <div className="row-posters">
                {movies?.map((movie) => (
                    ((isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
                        <img
                            //make a function - onSelectedMovie() that updates the store with the clicked/selected movie and navigates to movieDetails
                            //load the movie on movieDetails from the store 
                            //show a trailer from YT with react-player and maybe fetch from youtube api
                            onClick={() => onSelectedMovie(movie)}
                            className={`poster ${isLargeRow ? 'large-poster' : ''}`}
                            key={movie.id}
                            src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                            alt={movie.name}
                        />
                    )
                ))}
            </div>

        </div>
    )
}
