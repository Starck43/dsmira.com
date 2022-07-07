import {useEffect, useLayoutEffect, useRef, useState} from "react"
import {getCountdown, getNaturalImageSizes, getWindowDimensions} from "./utils"

export const useWindowDimensions = () => {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	)

	useEffect(() => {
		let handleResize = function () {
			setWindowDimensions(getWindowDimensions())
		}
		// console.log(`Window dimension: ${windowDimensions.width}px`)
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return windowDimensions
}


export const useScrollPosition = (container = document.documentElement, targetScroll = window.innerHeight) => {
	const [scroll, setScroll] = useState({
		position: 0,
		reachedTarget: false
	})

	const handleScroll = () => {
		setScroll({
			position: container.scrollTop,
			reachedTarget: container.scrollTop >= targetScroll
		})
	}

	useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return scroll
}


export const useElementInView = ({root = null, margin = "0px", threshold = 1, steps = 1, once = true}) => {
	const observe = useRef(null)
	const [isVisible, setVisible] = useState(false)

	const buildThresholds = () => {
		if (steps <= 1) return threshold

		let thresholds = []

		for (let i = 1.0; i <= steps; i++) {
			let ratio = i / steps
			thresholds.push(ratio)
		}
		return thresholds
	}

	useEffect(() => {
		if (
			!"IntersectionObserver" in window ||
			!"IntersectionObserverEntry" in window ||
			!"intersectionRatio" in window.IntersectionObserverEntry.prototype
		) {
			setVisible(true)
		} else {

			const intersectionCallback = (entries) => {
				let [entry] = entries
				//console.log(root, entry)

				if (once) {
					if (entry?.isIntersecting) {
						setVisible(true)
						observe?.current && observer.unobserve(observe.current)
					}
				} else {
					setVisible(entry?.isIntersecting)
				}
				/*
				  if (entry.isIntersecting && entry.boundingClientRect.top < 0) {
					console.log('direction to up', entry.target, entry.boundingClientRect.top)
				  }
				*/
			}

			const observer = new IntersectionObserver(intersectionCallback, {
				root: root,
				rootMargin: margin,
				threshold: buildThresholds()
			})

			observe?.current && observer.observe(observe.current)

			return () => observe?.current && observer.unobserve(observe.current)
		}
	}, [])

	return [observe, isVisible]
}


export const useLazyLoadImage = src => {
	const [sourceLoaded, setSourceLoaded] = useState(null)

	useEffect(() => {
		const img = new Image()
		img.src = src
		img.onload = () => setSourceLoaded(img.src)
	}, [src])

	return sourceLoaded
}


export const useImageData = (elem) => {
	const [imageData, setImageData] = useState({})
	useEffect(() => {
		let img = elem?.current.querySelector("img") || null
		if (img) {
			setImageData(getNaturalImageSizes(img))
		}
	}, [])
	return imageData
}


export const useTimeCounter = (datetime) => {
	const [countdown, setCountdown] = useState({})

	useEffect(() => {
		let count = getCountdown(datetime)
		setCountdown(count)
		if (Object.keys(count).length) {
			// Update the count down every 1 second
			const interval = setInterval(() => {

				// Get current date and time estimate
				let currentCountdown = getCountdown(datetime)
				if (currentCountdown) {
					setCountdown(currentCountdown)
				} else {
					clearInterval(interval)
				}

			}, 1000)

			return () => clearInterval(interval)
		}

	}, [])
	return countdown
}
