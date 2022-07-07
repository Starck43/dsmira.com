// import getConfig from 'next/config'

export const addClassToElements = (className, selector, node = document) => {
	let elements = node?.querySelectorAll(selector)
	elements.length && elements.forEach(el => el.classList.add(className))
}

export const removeClassToElements = (className, selector, node = document) => {
	let elements = node?.querySelectorAll(selector)
	elements.length && elements.forEach(el => el.classList.remove(className))
}

export const removeElementsByMask = (selector, node = document) => {
	let elements = node?.querySelectorAll(selector)
	elements.length && elements.forEach(el => el.remove())
}


export const getWindowDimensions = () => {
	if (typeof window !== "undefined") {
		let w = window.innerWidth

		const getMediaScreen = () => {
			switch (true) {
				case w < 320:
					return "xs"
				case w >= 320 && w < 576:
					return "sm"
				case w >= 576 && w < 756:
					return "md"
				case w >= 756 && w < 992:
					return "lg"
				case w >= 992 && w < 1200:
					return "xl"
				default:
					return "xxl"
			}
		}
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			ratio: window.innerWidth / window.innerHeight,
			media: getMediaScreen()
		}
	} else {
		return {
			width: 0,
			height: 0,
			ratio: 0
		}
	}
}

export const getNaturalImageSizes = (img) => {
	return {
		width: img?.naturalWidth,
		height: img?.naturalHeight,
		ratio: img?.naturalWidth / img?.naturalHeight,
	}
}

export const getYear = () => new Date().getFullYear()

export const getSiteLocation = () => (
	typeof window !== "undefined"
		? {
			url: location.protocol + "//" + location.host,
			name: location.hostname
		}
		: null
)

export const cleanDoubleSlashes = (str) => str.replace(/([^:]\/)\/+/g, "$1")

export const convertTime2Number = (str, unit="ms") => {
	let arr = str.match(/[^\d]+|\d+/g)
	let num = parseFloat(arr[0])

	if (typeof num === "number") {
		switch (arr[1]) {
			case "s" : return (unit === "ms") ? num * 1000 : num
			case "ms" : return (unit === "s") ? num / 1000 : num
			default: return num
		}
	}
	return 0
}

export const arrayToParams = (arr) => {
	return (arr.length > 0) ? "fields=" + arr.join("&") : ""
}

export const getUniqueArray = (arr, key = "") => {
	return (
		key
			? [...new Set(arr.map(data => data[key]))]
			: arr.filter((value, index, self) => self.indexOf(value) === index)
	)
}

export const smoothScroll = (target, offset) => {
	let topPosition = target.getBoundingClientRect().top

	typeof window !== "undefined" && window.scrollTo({
		top: topPosition + window.pageYOffset + offset,
		behavior: "smooth"
	})
}

export const getCountdown = (target) => {
	let now = new Date()

	// Find the distance between now and the count down date
	let distance = target - now

	// If the count down is finished
	if (distance < 0) return {}

	// Time calculations for days, hours, minutes and seconds
	let days = Math.floor(distance / (1000 * 60 * 60 * 24))
	let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
	let seconds = Math.floor((distance % (1000 * 60)) / 1000)

	return {days, hours, minutes, seconds}
}

export const createThumbUrl = (src, width) => {
	let path = src?.split(".") || []
	if (path.length > 1) {
		let ext = path.pop()
		let thumbName = "_" + width + "w"
		return path.join(".") + thumbName + "." + ext
	}
	return src
}

export const shimmer = (color, w, h = null, rounded) => (`
		<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<defs>
		<linearGradient id="g">
		<stop stop-color="${color}" offset="20%" />
		<stop stop-color="#fff" offset="50%" />
		<stop stop-color="${color}" offset="70%" />
		</linearGradient>
		</defs>
		${h === null || rounded
	? `<circle fill="${color}" cx="${w / 2}" cy="${w / 2}" r="${w / 2}"/><circle id="c" fill="url(#g)" cx="${w / 2}" cy="${w / 2}" r="${w / 2}"/>`
	: `<rect width="${w}" height="${h}" fill="${color}" /><rect id="r" width="${w}" height="${h}" fill="url(#g)" />`}
		<animate xlink:href="#c" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"/>
		</svg>
`)

export const toBase64 = (str) => (
	typeof window === "undefined"
		? Buffer.from(str).toString("base64")
		: window.btoa(str)
)

export const removeProtocol = (url) => url.replace(/^https?:\/\//i, "")

export const absoluteUrl = (url) => {
	if (url && url.indexOf("http", 0) === -1) return process.env.SERVER + url
	return url
}

export const truncateHTML = (value, n = 200) => {
	let t = value.substring(0, n) // first cut
	let tr = t.replace(/<(.*?[^\/])>.*?<\/\1>|<.*?\/>/, "") // remove opened+closed tags
	// capture open tags
	let ar = tr.match(/<((?!li|hr|img|br|area|base|col|command|embed|input|keygen|link|meta|head|param|source|track|wbr).*?)>/g)

	if (ar) return t + "&hellip;" + ar.reverse().join("").replace(/</g, "<\/") // close tags
	return value
}

export const isSafari = () => {
	let userAgent = navigator.userAgent.toLowerCase()
	return /^((?!chrome|android).)*safari/i.test(userAgent)
}
