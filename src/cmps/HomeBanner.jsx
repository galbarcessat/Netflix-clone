import { useEffect, useState } from "react"
import requests from "../requests"
import axios from "axios"
import { movieService } from "../services/movie.service.local"

export function HomeBanner() {
    const [movie, setMovie] = useState([])


    useEffect(() => {
        async function getMovieForBanner() {
            const res = await axios.get(requests.fetchNetflixOriginals)
            movieService.save(res.data.results)
            const randomIndex = Math.floor(Math.random() * res.data.results.length - 1)
            setMovie(res.data.results[randomIndex])

            return res
        }

        getMovieForBanner()

    }, [])

    function truncate(text, size) {
        return text?.length > size ? text.substr(0, size - 1) + '...' : text
    }

    console.log('movie:', movie)

    if (!movie) return <div>Loading...</div>
    return (
        <header className="home-banner"
            style={{
                backgroundSize: 'cover',
                backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
                backgroundPosition: 'center center'
            }}>

            <div className="banner-content">
                <h1 className="banner-title">
                    {movie?.name || movie?.original_name || movie?.title}
                </h1>

                <div className="banner-buttons">
                    <button className="banner-btn">Play</button>
                    <button className="banner-btn">My List</button>
                </div>

                <h1 className="banner-description">{truncate(movie?.overview, 150)}</h1>
            </div>

            <div className="banner-fade-bottom" />
        </header>
    )
}