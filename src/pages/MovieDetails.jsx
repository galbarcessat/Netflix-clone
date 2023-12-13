import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { HomeNavBar } from "../cmps/HomeNavBar"
import { storageService } from "../services/async-storage.service"
import axios from "axios"
import ReactPlayer from 'react-player'

export function MovieDetails() {
    const [movie, setMovie] = useState(null)
    const selectedMovie = useSelector(state => state.movieModule.selectedMovie)
    const VIDEOS_DB = 'videosDB'
    //FIX THE CACHING SYSTEM.
    useEffect(() => {
        async function getVideo() {
            const movieName = selectedMovie?.name || selectedMovie?.original_name || selectedMovie?.title
            const termVideosMap = await storageService.query(VIDEOS_DB) || {}
            console.log('termVideosMap:', termVideosMap)
            console.log('movieName:', movieName)
            console.log('termVideosMap[movieName]:', termVideosMap[movieName])
            console.log('try using find:', termVideosMap.find(movie => movie.name === movieName))
            if (termVideosMap[movieName]) {
                console.log('is already in local storage:')
                setMovie(termMovieMap[movieName])
                return termVideosMap[movieName]
            } else {
                const res = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=
                ${import.meta.env.VITE_YT_KEY}&q=${movieName}-trailer`)
                const firstResult = res.data.items[0]
                const movieTrailer = {
                    id: firstResult.id.videoId,
                    title: firstResult.snippet.title,
                    img: {
                        url: firstResult.snippet.thumbnails.default.url,
                        width: firstResult.snippet.thumbnails.default.width,
                        height: firstResult.snippet.thumbnails.default.height,
                    }
                }

                termVideosMap[movieName] = movieTrailer
                storageService.post(VIDEOS_DB, termVideosMap)
                console.log('saving to local storage termVideosMap:', termVideosMap)

                setMovie(movieTrailer)

                return movieTrailer
            }
        }

        getVideo()

    }, [])

    if (!movie) return <div>Loading movie</div>
    return (
        <>
            <HomeNavBar />
            <div className="movie-details-container">
                <div className='player-wrapper'>
                    <ReactPlayer width='100%' height='100%' className="react-player"
                        url={`https://www.youtube.com/watch?v=${movie.id}`} controls={true} />
                </div>
                <div className="movie-info">
                    <div className="poster-container">
                        <img className="movie-poster" src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`} alt="" />
                        <div>
                            <h1>{selectedMovie.name}</h1>
                            <h2>{selectedMovie.first_air_date}</h2>
                        </div>
                    </div>
                    <div className="movie-overview">
                        <h1>{selectedMovie.name}</h1>
                        <p>{selectedMovie.overview}</p>
                        <h2>language : {selectedMovie.original_language}</h2>
                    </div>
                </div>
            </div>
        </>
    )
}
