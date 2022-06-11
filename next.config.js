const path = require('path')
const isProduction = process.env.NODE_ENV === "production"
const protocol = isProduction ? 'https' : 'http'
const serverName = `${protocol}://${process.env.SERVER_HOST}`


module.exports = {
	env: {
		SERVER: serverName,
		API_SERVER: serverName + '/api',
		API_ENDPOINTS: {
				pages: '/pages/',
				posts: '/posts/',
				sections: '/sections/',
			},
	},
	publicRuntimeConfig: {},
	serverRuntimeConfig: {
		// Will only be available on the server side
		// mySecret: 'secret',
		// secondSecret: process.env.SECOND_SECRET, // Pass through env variables
	},
	images: {
		domains: [process.env.SERVER_HOST],
		//deviceSizes: [320, 576, 768, 992, 1200, 1400, 1920], // breakpoints
		//imageSizes: [320, 450, 640, 900, 1200], // breakpoints
	},
	compiler: {
			// ssr and displayName are configured by default
			styledComponents: true,
			relay: {
					// This should match relay.config.js
					src: './',
					artifactDirectory: './__generated__',
					language: 'typescript',
			},
	},
	sassOptions: {
			includePaths: [path.join(__dirname, 'styles')],
	},
}

