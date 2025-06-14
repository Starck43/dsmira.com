import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { IconContext } from "react-icons"

import Loader from "../components/UI/loader"
import ErrorBoundary from "../core/errorboundary"
import * as gtag from "../libs/gtag"

import "../styles/vendors.scss"
import "../styles/main.sass"

export default function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const [isLoaded, setLoaded] = useState(false)

    const isProduction = process.env.NODE_ENV === "production"

    useEffect(() => {
        const handleRouteChange = (url) => {
            /* invoke analytics function only for production */
            if (isProduction && process.env.GA_ANALYTICS_MEASUREMENT_ID) gtag.pageview(url)
        }
        router.events.on("routeChangeComplete", handleRouteChange)
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange)
        }
    }, [isProduction, router.events])

    useEffect(() => {
        setLoaded(true)
        //typeof window !== "undefined" && document.getElementById('__next').classList.add('loaded')
    }, [])

    if (!isLoaded) return <Loader />
    if (typeof window === "undefined") return <></>

    return (
        <ErrorBoundary>
            <IconContext value={{ className: "react-icons svg-icons", size: "40px" }}>
                <Component {...pageProps} loaded={isLoaded} />
            </IconContext>
        </ErrorBoundary>
    )
}
