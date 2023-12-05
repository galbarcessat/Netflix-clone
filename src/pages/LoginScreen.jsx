
import { useState } from 'react'
import NetflixLogo from '../assets/imgs/NetflixLogo.png'
import { SignUpScreen } from '../cmps/SignUpScreen'

export function LoginScreen() {

    const [signIn, setSignIn] = useState(false)


    return (
        <div className="login-screen-container">
            <div className="login-screen-background">
                <img
                    className="login-screen-logo"
                    src={NetflixLogo}
                    alt="" />
                <button onClick={() => setSignIn(true)} className='login-screen-btn'>Sign In</button>
                <div className='login-screen-gradient' />
            </div>

            <div className="login-screen-body">
                {signIn && <SignUpScreen />}
                {!signIn && <div className='get-started-container'>
                    <h1>Unlimited films,TV programmes and more.</h1>
                    <h2>Watch anywhere. Cancel at any time.</h2>
                    <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
                    <div className='login-screen-input'>
                        <form >
                            <input type="email" placeholder='Email Address' />
                            <button onClick={() => setSignIn(true)} className='get-started-btn'>GET STARTED</button>
                        </form>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}
