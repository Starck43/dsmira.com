import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Page from "../components/posts/page";
import Layout from "../components/layout";

import { getPages } from "../core/api";
import { smoothScroll } from "../core/utils";

export default function Index({ post }) {
  const router = useRouter();

  useEffect(() => {
    history.replaceState({}, "", window.location.href.split("#")[0]);

  }, []);

  return (
    <Layout meta={post.meta}>{router.isFallback ? <div>Загрузка...</div> : <Page {...post} page="home" />}</Layout>
  );
}

export async function getStaticProps() {
  const post = await getPages("homepage");

  return {
    props: {
      post: post || null
    }
    // revalidate: 60 * 60 * 24,
  };
}
