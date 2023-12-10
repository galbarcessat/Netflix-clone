import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, query, where, getDocs, doc, addDoc, onSnapshot } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";

export function Plans({ user }) {
    const [products, setProducts] = useState([])
    const [sub, setSub] = useState(null)

    useEffect(() => {
        async function fetchSubscriptions() {
            try {
                const subCollection = collection(db, 'customers', user.uid, 'subscriptions')
                const subscriptionSnapshot = await getDocs(subCollection)

                subscriptionSnapshot.forEach(subSnapshot => {
                    setSub({
                        role: subSnapshot.data().role,
                        current_period_end: subSnapshot.data().current_period_end.seconds,
                        current_period_start: subSnapshot.data().current_period_start.seconds,
                    })
                })

            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        }

        fetchSubscriptions()

    }, [user.uid])


    useEffect(() => {

        async function getDocuments() {
            try {
                const productsCollection = query(collection(db, "products"), where("active", "==", true))
                const querySnapshot = await getDocs(productsCollection)
                const products = {}

                querySnapshot.forEach(async productDoc => {
                    products[productDoc.id] = productDoc.data()

                    const pricesCollectionRef = collection(productDoc.ref, "prices")
                    const pricesQuerySnapshot = await getDocs(pricesCollectionRef)
                    pricesQuerySnapshot.forEach(price => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            priceData: price.data()
                        }
                    })
                })

                setProducts(products)
            } catch (error) {
                console.error("Error getting products:", error)
                throw error
            }
        }

        getDocuments()

    }, [])

    async function loadCheckout(priceId) {
        try {
            const checkoutSessionsCollectionRef = collection(db, 'customers', user.uid, 'checkout_sessions')
            const docRef = await addDoc(checkoutSessionsCollectionRef, {
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });

            onSnapshot(docRef, async (snap) => {
                const { error, sessionId } = snap.data()

                if (error) {
                    alert(`An error occurred: ${error.message}`)
                } else if (sessionId) {
                    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY)
                    stripe.redirectToCheckout({ sessionId })
                }
            });
        } catch (error) {
            console.error('Error creating checkout session:', error)
        }
    }


    return (
        <div className="plans-container">
            {sub && <p>Renewal date : {new Date(sub.current_period_end * 1000).toLocaleDateString()}</p>}
            {Object.entries(products).map(([productId, productData]) => {

                const isCurrentPackage = productData?.name.toLowerCase().includes(sub?.role.toLowerCase())

                return (
                    <div className="plan-container" key={productId}>
                        <div className="plan-info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>
                        <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}
                            className={"sub-btn " + (isCurrentPackage ? 'current-pack' : '')}>{isCurrentPackage ? 'Current Package' : 'Subscribe'}</button>
                    </div>
                )
            })}
        </div>
    )
}
