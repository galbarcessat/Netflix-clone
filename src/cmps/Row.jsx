import axios from "axios"
import { useEffect, useState } from "react"

export function Row({ title, fetchUrl, isLargeRow = false }) {

    const [movies, setMovies] = useState([])

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(fetchUrl)
            setMovies(res.data.results)
            return res
        }

        fetchData()
    }, [fetchUrl])

    console.log('movies:', movies)
    return (
        <div className="row-container">
            <h2>{title}</h2>

            <div className="row-posters">
                {movies?.map(movie => (
                    <img
                        className={"poster " + (isLargeRow ? 'large-poster' : '')}
                        key={movie.id}
                        src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
                ))}
            </div>

        </div>
    )
}
