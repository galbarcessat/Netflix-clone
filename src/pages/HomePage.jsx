import { HomeBanner } from "../cmps/HomeBanner";
import { HomeNavBar } from "../cmps/HomeNavBar";
import { RowList } from "../cmps/RowList";

export function HomePage() {

    return (
        <div>
            <HomeNavBar />
            <HomeBanner />
            <RowList />
        </div>
    )
}