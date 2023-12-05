import NetflixLogo from '../assets/imgs/NetflixLogo.png'
import NetflixAvatar from '../assets/imgs/NetflixAvatar.png'
import { useState } from 'react'
import { useEffect } from 'react'

export function HomeNavBar() {
    const [showNav, setShowNav] = useState(false)


    useEffect(() => {
        window.addEventListener('scroll', transitionNavBar)

        return () => {
            window.removeEventListener('scroll', transitionNavBar)
        }

    }, [])

    function transitionNavBar() {
        if (window.scrollY > 100) {
            setShowNav(true)
        } else {
            setShowNav(false)
        }
    }

    return (
        <div className={"home-nav-bar " + (showNav ? 'black' : '')}>
            <div className="nav-content">
                <img className="netflix-nav-logo" src={NetflixLogo} alt="" />
                <img className='avatar-nav-img' src={NetflixAvatar} alt="" />
            </div>
        </div>
    )
}
