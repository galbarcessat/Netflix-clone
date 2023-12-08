import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore";

export function Plans({user}) {
    const [products, setProducts] = useState([])

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

    console.log('products:', products)
    // FINISH AND LOADCHECOUT FUNCION!!!!!
    // async function loadCheckout(priceId) {
    //     const docRef =  collection("customers").doc(user.uid).collection("checkout_sessions").add({
    //         price : priceId

    //     })
    //     // const querySnapshot = await getDocs(docRef).
        
    // }

    return (
        <div className="plans-container">
            {Object.entries(products).map(([productId, productData]) => {


                return (
                    <div className="plan-container" key={productId}>
                        <div className="plan-info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>
                        <button onClick={() => loadCheckout(productData.prices.priceId)} className="sub-btn">Subscribe</button>
                    </div>
                )
            })}
        </div>
    )
}



// productsCollection
//     , where('active', '==', true)
//     , get()
//         .then(querySnapshot => {
//             const products = {}
//             querySnapshot.forEach(async productDoc => {
//                 products[productDoc.id] = productDoc.data()
//                 const priceSnap = await productDoc.ref.collection("prices").get()
//                 priceSnap.docs.forEach(price => {
//                     products[productDoc.id].prices = {
//                         priceId: price.id,
//                         priceData: price.data()
//                     }
//                 })
//             })
//             setProducts(products)
//         })
//         .catch(err => {
//             console.log('error:', err)
//             throw err
//         })