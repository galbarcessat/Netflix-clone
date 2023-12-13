import { useEffect, useState } from "react"
import requests from "../requests"
import axios from "axios"
import { SET_SELECTED_MOVIE } from "../store/reducers/movie.reducer"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

export function HomeBanner() {
    const [movie, setMovie] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        async function getMovieForBanner() {
            const res = await axios.get(requests.fetchNetflixOriginals)
            const randomIndex = Math.floor(Math.random() * res.data.results.length - 1)
            
            if(randomIndex === -1) setMovie(res.data.results[0])
            else setMovie(res.data.results[randomIndex])

            return res
        }

        getMovieForBanner()

    }, [])

    function truncate(text, size) {
        return text?.length > size ? text.substr(0, size - 1) + '...' : text
    }

    function onSelectedMovie(movie) {
        dispatch({ type: SET_SELECTED_MOVIE, selectedMovie: movie })
        navigate('/movie')
    }

    if (!movie) return <div>Loading...</div>
    return (
        <header className="home-banner"
            style={{
                backgroundSize: 'cover',
                backgroundImage: movie.backdrop_path
                    ? `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_flag.svg/1200px-Black_flag.svg.png',
                backgroundPosition: 'center center'
            }}>

            <div className="banner-content">
                <h1 className="banner-title">
                    {movie?.name || movie?.original_name || movie?.title}
                </h1>

                <div className="banner-buttons">
                    <button onClick={() => onSelectedMovie(movie)} className="banner-btn">Play</button>
                    <button className="banner-btn">My List</button>
                </div>

                <h1 className="banner-description">{truncate(movie?.overview, 150)}</h1>
            </div>

            <div className="banner-fade-bottom" />
        </header>
    )
}
