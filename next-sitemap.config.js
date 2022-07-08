module.exports = {
	siteUrl: "https://dsmira.com",
	generateRobotsTxt: true,
	changefreq: 'monthly',
	priority: 0.7,
	exclude: ["/disallowed"],
	alternateRefs: [],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/*",
			},
			{
				disallow: "*/?",
			},
			{
				disallow: "/search/?q=",
			},
			{
				disallow: "/api/*",
			},
		],
	},
}
