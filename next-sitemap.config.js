module.exports = {
	siteUrl: "https://dsmira.com",
	changefreq: "daily",
	priority: 0.7,
	sitemapSize: 5000,
	generateRobotsTxt: true,
	//exclude: ["/secret-page"],
	alternateRefs: [
		/*
		{
			href: 'https://en.example.com',
			hreflang: 'en',
		},
		*/
	],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: ["/"],
				disallow: ["/api/*", "/search/?"],
			},
		],
	},
}
