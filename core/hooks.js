import {useEffect, useState} from "react"
import {getCountdown, getNaturalImageSizes} from "./utils"


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

export const useImageData = (elem) => {
	const [imageData, setImageData] = useState({})
	useEffect(() => {
		let img = elem?.current.querySelector('img') || null
		if (img) {
			setImageData(getNaturalImageSizes(img))
		}
	}, [])
	return imageData
}

export const useFadeEffect = ref => {
	const [isVisible, setVisible] = useState(false)

	useEffect(() => {
		if (
			!"IntersectionObserver" in window ||
			!"IntersectionObserverEntry" in window ||
			!"intersectionRatio" in window.IntersectionObserverEntry.prototype
		) {
			setVisible(true)
		} else {
			/*
				  const buildThresholds = () => {
					let thresholds = []
					let steps = 20

					for (let i = 1.0; i <= steps; i++) {
					  let ratio = i / steps
					  thresholds.push(ratio)
					}
					return thresholds
				  }
			*/

			let options = {
				//root: document.querySelector('body'),
				rootMargin: "0px",
				threshold: 0.15, //buildThresholds
			}
			const observer = new IntersectionObserver(entries => {
				let entry = entries[0]
				if (entry.isIntersecting) {
					setVisible(true)
					ref && observer.unobserve(ref.current)
				}
				// console.log(entry.target)

				/*
								  if (entry.isIntersecting && entry.boundingClientRect.top < 0) {
									console.log('direction to up', entry.target, entry.boundingClientRect.top)
								  }
						*/
			}, options)

			ref && observer.observe(ref.current)

			return () => observer.unobserve(ref?.current)
		}
	}, [ref])

	return isVisible
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
