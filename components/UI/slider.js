import React, {createRef, Fragment, useEffect, useLayoutEffect, useRef, useState} from "react"
import styled from "styled-components/macro"
import Image from "next/image"

import Carousel from "nuka-carousel"
import ReactPlayer from "react-player"
import ProgressBar from "react-bootstrap/ProgressBar"

import {addClassToElements, createThumbUrl} from "../../core/utils"


const remoteLoader = ({src, width}) => {
	let breakpoints = [50, 320, 576, 768, 992, 1200]
	if (breakpoints.indexOf(width) !== -1)
		return createThumbUrl(src, width)
	return src
}

const Slider = ({
	                title,
	                excerpt,
	                slides = [],
	                current = 0,
	                interval = 0,
	                speed = 900,
	                infinite = true,
	                style = {},
	                objectFit = "cover",
	                label = "slider",
	                className = "",
                }) => {

	const carouselRef = useRef(null)
	const [showSlideCaption, setShowSlideCaption] = useState(true)
	const [slideInterval, setSlideInterval] = useState(interval)
	const [slidersState, setSlidersState] = useState(
		slides?.reduce((acc, value) => {
			acc[value.id] = {
				ref: createRef(),
				id: value.id,
				url: value.video || value.link || null,
				margin: 0,
				loaded: 0,
				played: 0,
				playing: false,
				ended: false,
			}
			return acc
		}, {})
	)

	/*

		useEffect(() => {
			setSlidersState()
		}, [])
	*/


	const handleSlideChange = (current, next) => {

		//console.log('change', slidersState, current, next)
		if (slidersState) {
			// if current slide is video and it goes to next
			let currentSlider = slidersState[slides[current]?.id]
			if (current !== next && currentSlider?.ref?.current) {
				currentSlider.ended && currentSlider.ref.current?.seekTo(0, "fraction")
				currentSlider.playing = false
				currentSlider.ended = false
				// save player's state : current
				setSlidersState({
					...slidersState,
					[slides[current].id]: currentSlider,
				})
			}

			// get a new active player state
			let nextSlider = slidersState[slides[next]?.id]
			if (nextSlider?.ref?.current) {
				nextSlider.playing = true

				// save player's state : next
				setSlidersState({
					...slidersState,
					[slides[next].id]: nextSlider,
				})
			}

			// drop slideshow interval after changing a slide
			setSlideInterval(Number(nextSlider?.url === null) * interval)
		}
	}


	const handleOnStart = (id) => () => {
		// toggle "loaded" class for smooth player appearing for the first time
		addClassToElements("loaded", `[data-player-id="${id}"]`, carouselRef?.current)
	}


	const handleOnPlay = (id) => () => {
		let currentSlider = slidersState[id]

		if (!currentSlider.playing) {
			currentSlider.playing = true

			setSlidersState({
				...slidersState,
				[id]: currentSlider,
			})
		}
	}


	const handleOnPause = (id) => () => {
		let currentSlider = slidersState[id]

		if (currentSlider.playing) {
			currentSlider.playing = false

			setSlidersState({
				...slidersState,
				[id]: currentSlider,
			})
		}
	}


	const handleProgress = (id) => (state) => {
		let currentSlider = slidersState[id]

		// detect video position before second to finish
		let elapsed = currentSlider.ref?.current.getDuration() - currentSlider.ref?.current.getCurrentTime()
		let ended = !currentSlider.ended && elapsed <= 1
		if (ended) {
			currentSlider.ended = true
			currentSlider.playing = false
		}

		currentSlider.played = state.played
		currentSlider.loaded = state.loaded

		setSlidersState({
			...slidersState,
			[id]: currentSlider,
		})

		// go to next slide after full video watching
		ended && setSlideInterval(900)
	}


	return (
		slides?.length > 0 &&
		<Carousel
			innerRef={carouselRef}
			className={`${label} ${className}`}
			//adaptiveHeight
			wrapAround={infinite} /* player doesn't work correctly with cloned slides in infinite mode */
			enableKeyboardControls
			slideIndex={current}
			cellSpacing={1}
			dragThreshold={0.2}
			withoutControls={slides.length < 2}
			autoplay={Boolean(slideInterval)}
			autoplayInterval={slideInterval}
			pauseOnHover={slideInterval > 1}
			speed={speed}
			style={style}
			defaultControlsConfig={{
				containerClassName: `slider-control`,
				nextButtonText: " ",
				prevButtonText: " ",
				prevButtonClassName: `arrow left ${label === "lightbox" ? "white" : ""}`,
				nextButtonClassName: `arrow right ${label === "lightbox" ? "white" : ""}`,
				pagingDotsStyle: {fill: `${label === "lightbox" ? "white" : "black"}`}
			}}
			renderAnnounceSlideMessage={({currentSlide}) =>
				`${currentSlide + 1} / ${slides.length}`
			}
			frameAriaLabel={`${className}_${label}`}
			beforeSlide={handleSlideChange}
		>
			{slides?.map((obj) => (
				<Fragment key={obj.id}>
					{obj.file &&
					<>
						<Image
							loader={remoteLoader}
							src={obj.file}
							alt={obj.title}
							width={obj.width}
							height={obj.height}
							quality={80}
							layout="responsive"
							objectFit={label === "lightbox" || obj.width / obj.height < 1.4 ? "contain" : objectFit}
							placeholder="blur"
							blurDataURL={createThumbUrl(obj.file, 50)}
							onClick={() => setShowSlideCaption(!showSlideCaption)}
						/>
						{
							(obj.title || obj.excerpt) &&
							<figcaption className={`carousel-caption fade ${showSlideCaption ? "show" : "hide"}`}>
								{label === "lightbox" && <h3 className="title">{title}</h3>}
								<h4 className="subtitle">{obj.title}</h4>
								<p className="excerpt">{obj.excerpt}</p>
							</figcaption>
						}
					</>
					}

					{slidersState && slidersState[obj.id]?.url && ReactPlayer.canPlay(slidersState[obj.id]?.url) &&
					<div className="player"
					     data-player-id={obj.id}
					     style={{
						     // width: slidersState[obj.id].width,
						     // height: slidersState[obj.id].height,
						     // top: slidersState[obj.id].height !== "100%" ? slidersState[obj.id].margin : 0,
						     // left: slidersState[obj.id].width !== "100%" ? slidersState[obj.id].margin : 0,
					     }}>
						<ProgressBar>
							<ProgressBar now={slidersState[obj.id]?.played * 100} bsPrefix="played"/>
							<ProgressBar now={(slidersState[obj.id]?.loaded - slidersState[obj.id]?.played) * 100}
							             bsPrefix="loaded"/>
						</ProgressBar>
						<ReactPlayer
							ref={slidersState[obj.id]?.ref}
							className={`react-player`}
							style={obj?.file && {
								//background: `url(${createThumbUrl(obj.file, 50)}) no-repeat center center / cover`,
							}}
							url={slidersState[obj.id]?.url}
							width="100%"
							height="100%"
							volume={0.6}
							muted
							loop
							playing={slidersState[obj.id]?.playing}
							onStart={handleOnStart(obj.id)}
							onPlay={handleOnPlay(obj.id)}
							onPause={handleOnPause(obj.id)}
							onProgress={handleProgress(obj.id)}
							config={{
								youtube: {},
								vimeo: {
									responsive: true,
									//playsInline: false,
									autoPause: true,
									autoPlay: false,
								},
								file: {
									attributes: {
										autoPlay: false,
										preload: "metadata",
										//crossOrigin: "anonymous",
										//poster: obj?.file
									},
									//forceVideo: true,
								}
							}}
						/>
					</div>
					}
				</Fragment>
			))}
		</Carousel>
	)
}


export default Slider


