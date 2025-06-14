import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getPageDetail, getSection } from "/core/api";

import Layout from "../../components/layout";
import Page from "../../components/posts/page";


export default function ProjectDetail({ post, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.id) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout meta={post.meta} preview={preview}>
      {router.isFallback ? <div>Загрузка...</div> : <Page {...post} page="project-detail" />}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const post = (await getPageDetail(params.id, "projects")) || [];
  if (!post) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  return {
    props: {
      post
    }
    // revalidate: 60 * 60 * 24,
  };
}

export async function getStaticPaths() {
  // fetching all posts only with a 'slug' field
  const posts = (await getSection("projects")) || [];

  return {
    paths: posts.map((page) => {
      return {
        params: {
          id: page.id.toString()
        }
      };
    }),
    fallback: false
  };
}
