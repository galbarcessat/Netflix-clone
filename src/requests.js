const TMDB_base_URL = 'https://api.themoviedb.org/3'

const TMDB_API_KEY = '89eea2bd8bf894fa628ffdb67989ac57'

const requests = {
    fetchTrending: `${TMDB_base_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
    fetchNetflixOriginals: `${TMDB_base_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`,
    fetchTopRated: `${TMDB_base_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
    fetchActionMovies: `${TMDB_base_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
    fetchComedyMovies: `${TMDB_base_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
    fetchHorrorMovies: `${TMDB_base_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
    fetchRomanceMovies: `${TMDB_base_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
    fetchDocumentaries: `${TMDB_base_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`,
}

export default requests