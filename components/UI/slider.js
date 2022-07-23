import React, {createRef, useCallback, useEffect, useRef, useState} from "react"
//import styled from "styled-components/macro"
import Image from "next/image"

import {Swiper, SwiperSlide} from "swiper/react"
import {Lazy, Pagination, Keyboard, Zoom, Autoplay, Parallax} from "swiper"

import "swiper/css"
import "swiper/css/lazy"
import "swiper/css/autoplay"
import "swiper/css/pagination"
import "swiper/css/parallax"


import ReactPlayer from "react-player/lazy"
import ProgressBar from "react-bootstrap/ProgressBar"

import {addClassToElements, createThumbUrl} from "../../core/utils"
import {useWindowDimensions} from "../../core/hooks"


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
	                duration = 900,
	                infinite = true,
	                direction = "horizontal",
	                autoHeight = false,
	                responsive = null,
	                effect = "slide",
	                objectFit = "cover",
	                label = "slider",
	                className = "",
	                style = {},
                }) => {

	const carouselRef = useRef(null)
	const {width} = useWindowDimensions()
	const [currentIndex, setCurrentIndex] = useState(current)
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
			console.log(carouselRef.current?.swiper)
		}, [])

	*/

	const handlePrev = useCallback(() => {
		//if (!carouselRef.current) return
		carouselRef.current?.swiper.slidePrev()
	}, [])


	const handleNext = useCallback(() => {
		//if (!carouselRef.current) return
		carouselRef.current?.swiper.slideNext()
	}, [])


	const handleSlideInitialized = ({imagesToLoad, activeIndex, autoplay}) => {
		label === "lightbox" && imagesToLoad.forEach(img => {
			img.parentNode.classList.add("swiper-zoom-container")
		})

		let currentSlider = slidersState[slides[activeIndex]?.id]
		if (currentSlider?.ref?.current) {
			currentSlider.playing = true

			// save player's state : next
			setSlidersState({
				...slidersState,
				[slides[activeIndex].id]: currentSlider,
			})
		}

		// drop slideshow interval if video slide is current
		setSlideInterval(currentSlider?.url ? 900 : interval)
		autoplay?.stop()
	}


	const handleSlideChange = ({previousIndex, realIndex, activeIndex, autoplay}) => {
		setCurrentIndex(realIndex)

		let prev = infinite && previousIndex > 0 ? previousIndex - 1 : previousIndex
		let previousSlider = slidersState[slides[prev]?.id]
		// if prev slide is video
		if (previousSlider?.url) {
			previousSlider.playing = false
			previousSlider.ended && previousSlider.ref.current?.seekTo(0, "fraction")
			previousSlider.ended = false
			// save player's state : current
			setSlidersState({
				...slidersState,
				[slides[prev].id]: previousSlider,
			})
		}

		let nextSlider = slidersState[slides[realIndex]?.id]
		if (nextSlider?.url) {
			nextSlider.playing = true

			// save player's state : next
			setSlidersState({
				...slidersState,
				[slides[realIndex].id]: nextSlider,
			})
		}

		// drop slideshow interval after changing a slide
		setSlideInterval(nextSlider?.url ? 900 : interval)
		autoplay?.stop()

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
			//currentSlider.playing = false
		}

		currentSlider.played = state.played
		currentSlider.loaded = state.loaded

		setSlidersState({
			...slidersState,
			[id]: currentSlider,
		})

		// go to next slide after full video watching
		ended && carouselRef.current?.swiper?.autoplay?.start()
	}


	return (
		slides?.length > 0
			? <div className={`carousel-container ${label}`}>
				<Swiper
					ref={carouselRef}
					className={className}
					style={style}
					modules={[Lazy, Pagination, Keyboard, Zoom, Autoplay, Parallax]}
					initialSlide={current}
					pagination={{
						clickable: true,
						dynamicBullets: true,
						hideOnClick: false,
						type: "bullets"
					}}
					preloadImages={false}
					lazy={{
						enabled: true,
						//loadPrevNext: true,
						loadOnTransitionStart: true,
					}}
					parallax
					keyboard
					zoom
					effect={effect}
					speed={duration}
					autoplay={{
						delay: slideInterval
					}}
					loop={infinite}
					direction={direction}
					breakpoints={responsive}
					centeredSlides
					grabCursor
					watchOverflow
					autoHeight={autoHeight}
					//passiveListeners={false}
					onInit={handleSlideInitialized}
					onSlideChangeTransitionStart={handleSlideChange}
				>
					{slides?.map((obj) => (
						<SwiperSlide key={obj.id} onClick={() => setShowSlideCaption(!showSlideCaption)}>
							{obj.file &&
							<>
								<Image
									className="swiper-zoom-target swiper-lazy"
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
									//unoptimized
								/>
								<div className="swiper-lazy-preloader"/>
								{
									(obj.title || obj.excerpt) &&
									<figcaption className={`carousel-caption ${showSlideCaption ? "show" : "hide"}`}>
										{label === "lightbox" &&
										<h3 className="title"
										    data-swiper-parallax-opacity="0"
										    data-swiper-parallax="-200"
										    data-swiper-parallax-duration={duration}
										>
											{title}
										</h3>
										}
										<h4 className="subtitle"
										    data-swiper-parallax-opacity="0"
										    data-swiper-parallax="-200"
										    data-swiper-parallax-duration={duration * 1.1}
										>
											{obj.title}
										</h4>
										<p className="excerpt"
										   data-swiper-parallax-opacity="0"
										   data-swiper-parallax="-200"
										   data-swiper-parallax-duration={duration * 1.2}
										>
											{obj.excerpt}
										</p>
									</figcaption>
								}
							</>
							}

							{slidersState && ReactPlayer.canPlay(slidersState[obj.id]?.url) &&
							<div className="player" data-player-id={obj.id}>
								<ProgressBar>
									<ProgressBar now={slidersState[obj.id]?.played * 100} bsPrefix="played"/>
									<ProgressBar
										now={(slidersState[obj.id]?.loaded - slidersState[obj.id]?.played) * 100}
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
										youtube: {
											controls: 0,
											playsInline: 1,
											rel: 0,
											showInfo: 0,
											color: "white",
											modestBranding: 1,
										},
										vimeo: {
											autoPlay: false,
											playsInline: true,
											autoPause: true,
											responsive: true,
										},
										file: {
											attributes: {
												playsInline: true,
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
						</SwiperSlide>
					))}
					{
						label === "lightbox" &&
						<div className="swiper-fraction">
							<span className="current-image">{currentIndex+1}</span>
							/
							<span className="total-images">{slides.length}</span>
						</div>
					}
				</Swiper>
				{width > 576 ? (<>
					<div
						className={`swiper-control-next ${!infinite && carouselRef.current?.swiper.isEnd ? "disabled" : ""}`}
						onClick={handleNext}>
						<span className={`arrow right`}/>
					</div>
					<div
						className={`swiper-control-prev ${!infinite && carouselRef.current?.swiper.isBeginning ? "disabled" : ""}`}
						onClick={handlePrev}>
						<span className={`arrow left`}/>
					</div>
				</>) : null}
			</div>
			: null
	)
}


export default Slider


