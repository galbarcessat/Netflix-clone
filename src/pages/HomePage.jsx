import { useNavigate } from "react-router-dom";
import { HomeBanner } from "../cmps/HomeBanner";
import { HomeNavBar } from "../cmps/HomeNavBar";
import { RowList } from "../cmps/RowList";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export function HomePage() {
    return (
        <div>
            <HomeNavBar />
            <HomeBanner />
            <RowList />
        </div>
    )
}