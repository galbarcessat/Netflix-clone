import { HomeNavBar } from "../cmps/HomeNavBar";
import NetflixAvatar from '../assets/imgs/NetflixAvatar.png'
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Plans } from "../cmps/Plans";

export function ProfileScreen() {
    const user = useSelector(state => state.userModule.user)

    return (
        <div className="profile-screen-container">
            <HomeNavBar />
            <div className="profile-screen-body">
                <h1>Edit Profile</h1>
                <div className="profile-screen-info">
                    <img src={NetflixAvatar} alt="" />
                    <div className="profile-screen-details">
                        <h2>{user.email}</h2>
                        <div className="profile-screen-plans">
                            <h3>Plans</h3>
                            <Plans user={user} />
                            <button onClick={() => signOut(auth)} className="sign-out-btn">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
