import Head from "next/head"
import {SITE_NAME, SITE_URL} from "../core/constants"


const Seo = ({name, logo, seo}) => (
	<Head>
		<meta charSet="utf-8"/>
		<title>{name}</title>
		{Object.keys(seo).length && (
			<>
				<meta name="title" content={seo.title}/>
				<meta name="description" content={seo.description}/>
				<meta name="keywords" content={seo.keywords}/>
				<meta property="og:description" content={seo.description}/>
				<meta property="og:title" content={seo.title}/>
			</>
		)}
		<meta property="og:site_name" content={SITE_NAME}/>
		<meta property="og:type" content="website"/>
		<meta property="og:locale" content="ru_RU"/>
		<meta property="og:image" content={logo}/>

		<link
			rel="preload"
			as="image"
			href="/logo.svg"
			//crossOrigin="true"
		/>
		{process.env.NODE_ENV === "production" && (
			<>
				<link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg"/>
				<link rel="icon" type="image/png" href="/favicons/favicon.png"/>
				<link
					href="/fonts/roboto-regular.woff2"
					rel="preload"
					as="font"
					crossOrigin="true"
				/>
				<meta name="robots" content="follow, index"/>
				{process.env.YANDEX_VERIFICATION &&
				<meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION}/>}
				<link rel="canonical" href={SITE_URL}/>
			</>
		)}

		{process.env.NODE_ENV === "production" && process.env.GA_ANALYTICS_MEASUREMENT_ID && (
			<>
				<meta name="googlebot" content="index, follow"/>
				<script
					async
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ANALYTICS_MEASUREMENT_ID}`}
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_ANALYTICS_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
					}}
				/>
			</>
		)}

		{process.env.NODE_ENV === "production" && process.env.YANDEX_METRIKA_ID && (
			<>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
								m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
							(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

							ym(${process.env.YANDEX_METRIKA_ID}, "init", {
								clickmap:true,
								trackLinks:true,
								accurateTrackBounce:true
							});
						`,
					}}
				/>
				<noscript
					dangerouslySetInnerHTML={{
						__html: `
							<div><img src="https://mc.yandex.ru/watch/${process.env.YANDEX_METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div>
						`,
					}}
				/>
			</>
		)}
	</Head>
)

export default Seo
