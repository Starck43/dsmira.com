import { useEffect } from "react";
import { useRouter } from "next/router";
import { getPages } from "/core/api";

import Page from "../../components/posts/page";
import Layout from "../../components/layout";

export default function ProjectsPage({ post }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(router.pathname);
  }, []);

  return (
    <Layout meta={post.meta}>
      {router.isFallback ? <div>Загрузка...</div> : <Page {...post} page="projects" />}
    </Layout>
  );
}

export async function getStaticProps() {
  const post = await getPages("projects");

  return {
    props: {
      post: post || null
    }
    // revalidate: 60 * 60 * 24,
  };
}
