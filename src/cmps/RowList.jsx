import requests from "../requests";
import { Row } from "./Row";

export function RowList() {
    return (
        <>
        {/* {requests.objectKeys.map(title=> (
            <Row title={title}/>
        ))} */}
            <Row
                title='NETFLIX ORIGINALS'
                fetchUrl={requests.fetchNetflixOriginals}
                isLargeRow />
            <Row
                title='Top Rated'
                fetchUrl={requests.fetchTopRated} />
            <Row
                title='Action Movies'
                fetchUrl={requests.fetchActionMovies} />
            <Row
                title='Comedy Movies'
                fetchUrl={requests.fetchComedyMovies} />
            <Row
                title='Horror Movies'
                fetchUrl={requests.fetchHorrorMovies} />
            <Row
                title='Romance Movies'
                fetchUrl={requests.fetchRomanceMovies} />
            <Row
                title='Documentaries'
                fetchUrl={requests.fetchDocumentaries} />

        </>
    )
}
