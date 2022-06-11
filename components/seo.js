import Head from "next/head"
import DATA, {HOME_TITLE, SITE_NAME, SITE_URL} from "../core/constants"

const Seo = ({name, logo, seo}) => (
	<Head>
		<meta charSet="utf-8"/>
		<title>{name}</title>
		<meta name="title" content={seo.title}/>
		<meta name="description" content={seo.description}/>
		<meta name="keywords" content={seo.keywords}/>
		<meta property="og:type" content="website"/>
		<meta property="og:locale" content="ru_RU"/>
		<meta property="og:site_name" content={SITE_NAME}/>
		<meta property="og:description" content={seo.description}/>
		<meta property="og:title" content={seo.title}/>
		<meta property="og:image" content={logo}/>

		<link
			rel="preload"
			as="image"
			href={DATA.logo}
			crossOrigin="true"
		/>
		{process.env.NODE_ENV === "production" && (
			<>
				<link
					href="/fonts/regular.woff2"
					rel="preload"
					as="font"
					crossOrigin="true"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/svg"
					href={DATA.logo}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicons/favicon-16x16.png"
				/>
				<link
					rel="mask-icon"
					href="/favicons/safari-pinned-tab.svg"
					color={DATA.safariColor}
				/>

				<link rel="manifest" href="/favicons/site.webmanifest"/>
				<meta name="msapplication-TileColor" content={DATA.msTileColor}/>
				<meta name="msapplication-config" content="/favicons/browserconfig.xml"/>
				<meta name="theme-color" content={DATA.themeColor}/>
				<link rel="shortcut icon" href="/favicons/favicon.ico"/>
				<link rel="alternate" type="application/rss+xml" href="/feed.xml"/>

				<meta name="robots" content="follow, index"/>
				<meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION}/>
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
