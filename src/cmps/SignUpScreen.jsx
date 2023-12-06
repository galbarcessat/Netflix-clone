import { useRef } from "react"
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../firebase"
import { useNavigate } from "react-router-dom"

export function SignUpScreen() {
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const navigate = useNavigate()

    async function register(e) {
        e.preventDefault()
        try {
            const user = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            console.log('new user:', user)
            navigate('/')
        } catch (error) {
            console.log('error:', error)
            alert(error.message)
        }
    }

    async function signIn(e) {
        e.preventDefault()
        try {
            const user = await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            console.log('user from sign in:', user)
            navigate('/')
        } catch (error) {
            console.log('error:', error)
            alert(error.message)
        }
    }
    return (
        <div className="signup-screen-container">
            <form>
                <h1>Sign In</h1>
                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passwordRef} type="password" placeholder="Password" />
                <button onClick={(e) => signIn(e)} type="submit">Sign In</button>
                <h4>
                    <span className="new-to-netflix">New to Neftlix? </span>
                    <span onClick={(e) => register(e)} className="sign-up-now"> Sign Up now.</span>
                </h4>
            </form>
        </div>
    )
}
