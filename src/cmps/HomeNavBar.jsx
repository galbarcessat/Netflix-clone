import NetflixLogo from '../assets/imgs/NetflixLogo.png'
import NetflixAvatar from '../assets/imgs/NetflixAvatar.png'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomeNavBar() {
    const [showNav, setShowNav] = useState(false)
    const navigate = useNavigate()

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
                <img onClick={() => navigate('/')} className="netflix-nav-logo" src={NetflixLogo} alt="" />
                <img onClick={() => navigate('/profile')} className='avatar-nav-img' src={NetflixAvatar} alt="" />
            </div>
        </div>
    )
}
