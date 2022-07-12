import Page from "../components/posts/page"
import Layout from "../components/layout"

import {getPages} from "../core/api"
import {useEffect} from "react"
import {useRouter} from "next/router"
import {smoothScroll} from "../core/utils"


export default function Index({post}) {
	const router = useRouter()
	const hash = router.asPath.replace("/", "")

	useEffect(() => {

		router.replace(router.pathname)

		setTimeout(() => {
			let el = hash && typeof window !== "undefined" ? document.querySelector(hash) : null
			el && smoothScroll(el, -180)
		}, 100)

		return () => clearTimeout()

	}, [])

	return (
		<Layout meta={post.meta}>
			{router.isFallback
				? <div>Загрузка...</div>
				: <Page {...post} page="home"/>
			}
		</Layout>
	)
}

export async function getStaticProps() {
	const post = await getPages("homepage")

	return {
		props: {
			post: post || null
		},
		revalidate: 60 * 60 * 24,
	}
}
