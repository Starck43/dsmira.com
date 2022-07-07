import {IconContext} from 'react-icons'
import { useRouter } from "next/router"
import {useEffect, useState} from "react"

import * as gtag from "../libs/gtag"

import "../styles/vendors.scss"
import "../styles/main.sass"


export default function MyApp({ Component, pageProps }) {
	const router = useRouter()
	const [useSsr, setUseSsr] = useState(false);

	const isProduction = process.env.NODE_ENV === "production"

	useEffect(() => {
		const handleRouteChange = url => {
			/* invoke analytics function only for production */
			if (isProduction) gtag.pageview(url)
		}
		router.events.on("routeChangeComplete", handleRouteChange)
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange)
		}
	}, [router.events])

	useEffect(() => {
		setUseSsr(true)
	}, [])

	if (!useSsr) return null
	if (typeof window === 'undefined') return <></>

	return (
		<IconContext.Provider value={{className: 'react-icons svg-icons', size: '3rem'}}>
			<Component {...pageProps} />
		</IconContext.Provider>
	)
}
