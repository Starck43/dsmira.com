const path = require("path")

//const isProduction = process.env.NODE_ENV === "production"

module.exports = {
    env: {
        SERVER: process.env.SERVER,
        API_SERVER: process.env.SERVER + "/api",
        API_ENDPOINTS: {
            pages: "/pages/",
            posts: "/posts/",
            sections: "/sections/",
            feedback: "/feedback/",
        },
    },
    publicRuntimeConfig: {},
    serverRuntimeConfig: {
        // Will only be available on the server side
        // mySecret: 'secret',
        // secondSecret: process.env.SECOND_SECRET, // Pass through env variables
    },
    images: {
        domains: ["localhost", process.env.SERVER_HOST],
        deviceSizes: [50, 320, 576, 768, 992, 1200, 1400], // breakpoints
        //imageSizes: [75, 150, 300, 600], // breakpoints
    },
    compiler: {
        // ssr and displayName are configured by default
        styledComponents: true,
        relay: {
            // This should match relay.config.js
            src: "./",
            artifactDirectory: "./__generated__",
            language: "typescript",
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    /*	async headers() {
		return [
			{
				source: "/fonts/Montserrat-Regular.woff2",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/fonts/Montserrat-Bold.woff2",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		]
	},*/
}
