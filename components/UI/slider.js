import React, {Fragment, useEffect, useRef, useState} from "react"
import Link from "next/link"

import AwesomeSlider from "react-awesome-slider"
import withAutoplay from "react-awesome-slider/dist/autoplay"
import ReactPlayer from "react-player"

import {createThumbUrl} from "../../core/utils"

/*
const remoteLoader = ({src, width}) => {
	let breakpoints = [50, 320, 576, 768, 1080, 1200]
	if (breakpoints.indexOf(width) !== -1)
		return createThumbUrl(src, width)
	return src
}*/
const AutoplaySlider = AwesomeSlider

const Slider = ({title, excerpt, description, slides}) => {
	//const playerRef = useRef()
	const [isPlaying, setPlaying] = useState(false)

	const handleTransitionStart = ({currentSlide, currentIndex}) => {
		let video = currentSlide.querySelector(".react-player")
		video && setPlaying(false)
		console.log('start',isPlaying)
	}

	const handleTransitionEnd = ({currentSlide, currentIndex}) => {
		let video = currentSlide.querySelector(".react-player")
		video && setPlaying(true)
		console.log('end',isPlaying)

	}

	return (
		<AutoplaySlider
			className="slider"
			name="aweSlider"
			//play={true}
			//fillParent={true}
			bullets={false}
			cancelOnInteraction={true} // should stop playing on user interaction
			interval={6000}
			onTransitionStart={handleTransitionStart}
			onTransitionEnd={handleTransitionEnd}
		>
			{
				slides.map(obj => (
					<div key={obj.id}
					     data-src={obj.file}
					     style={{
						     position: "absolute",
						     top: 0,
						     left: 0,
						     width: "100%",
						     height: "100%",
						     background: `url(${createThumbUrl(obj.file, 50)}) center no-repeat`,
						     backgroundSize: "cover",
					     }}>
						{(obj.link || obj.video) &&
						<ReactPlayer
							//ref={playerRef}
							className="react-player"
							url={obj.link || obj.video}
							width="100%"
							height="100%"
							loop
							playing={isPlaying}
							config={{
								youtube: {},
								vimeo: {
									responsive: true,
								}
							}}
						/>}
					</div>
				))
			}
		</AutoplaySlider>
	)
}

export default Slider



