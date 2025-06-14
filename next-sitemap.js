const excludedPaths = ["/api", "/search",]

module.exports = {
    siteUrl: "https://dsmira.com",
    generateRobotsTxt: true,
    exclude: excludedPaths,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
            },
            {
                userAgent: "*",
                disallow: excludedPaths,
            },
        ],
    },
}
