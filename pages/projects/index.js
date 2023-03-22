import Page from "../../components/posts/page"
import Layout from "../../components/layout"
import { getPages } from "/core/api"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function ProjectsPage({ post }) {
    const router = useRouter()

    useEffect(() => {
        router.replace(router.pathname)
    }, [])

    return (
        <Layout meta={post.meta}>
            {router.isFallback ? <div>Загрузка...</div> : <Page {...post} page="projects" />}
        </Layout>
    )
}

export async function getStaticProps() {
    const post = await getPages("projects")

    return {
        props: {
            post: post || null,
        },
        revalidate: 60 * 60 * 24,
    }
}
