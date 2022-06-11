import Page from '../components/posts/page'
import Layout from '../components/layout'

import {getPages} from "../core/api"


export default function Index({post}) {

	return (
		<Layout meta={post.meta}>
			<Page {...post}/>
		</Layout>

	)
}

export async function getStaticProps() {
	const post = await getPages('homepage')

	return {
		props: {
			post: post || null
		},
		revalidate: 60 * 60 * 24,
	}
}
