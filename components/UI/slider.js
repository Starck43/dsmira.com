import React, {createRef, useCallback, useEffect, useRef, useState} from "react"
//import styled from "styled-components/macro"
import Image from "next/image"

import {Swiper, SwiperSlide} from "swiper/react"
import {Lazy, Pagination, Keyboard, Zoom, Autoplay, Parallax, FreeMode} from "swiper"

import "swiper/css"
import "swiper/css/zoom"
import "swiper/css/lazy"
import "swiper/css/autoplay"
import "swiper/css/pagination"
import "swiper/css/parallax"
import "swiper/css/free-mode"


import {createThumbUrl} from "../../core/utils"
import {useWindowDimensions} from "../../core/hooks"
import Player from "./player"


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
	                infinite = false,
	                direction = "horizontal",
	                autoHeight = false,
	                responsive = null,
	                effect = "slide",
	                paginationType = "bullets",
	                zoom = false,
	                parallax = false,
	                freeScroll = false,
	                objectFit = "cover",
	                label = "slider",
	                className = "",
	                style = {},
	                children = null
                }) => {

	const carouselRef = useRef(null)
	const {width} = useWindowDimensions()
	const [currentIndex, setCurrentIndex] = useState(current)
	const [showSlideCaption, setShowSlideCaption] = useState(true)
	const [slideInterval, setSlideInterval] = useState(interval)
	const [sliderState, setSliderState] = useState(
		slides?.reduce((acc, value) => {
			acc[value.id] = {
				ref: createRef(),
				id: value.id,
				url: value.video || value.link || null,
				loaded: 0,
				played: 0,
				playing: false,
				ended: false,
			}
			return acc
		}, {})
	)


	useEffect(() => {
		console.log(carouselRef.current?.swiper)
		console.log(sliderState)
	}, [])


	const handlePrev = useCallback(() => {
		carouselRef.current?.swiper.slidePrev()
	}, [])


	const handleNext = useCallback(() => {
		carouselRef.current?.swiper.slideNext()
	}, [])


	const handleSlideInitialized = ({slides, activeIndex, autoplay}) => {
		// adding Zoom class to images' containers
		label === "lightbox" && slides.forEach(obj => {
			let img = obj.querySelector("img")
			img && img.parentElement.classList.add("swiper-zoom-container")
		})

		let currentSlider = sliderState[slides[activeIndex]?.id]
		if (currentSlider?.url) {
			autoplay?.stop()
			setSlideInterval(900)

			currentSlider.playing = true

			// save player's state
			setSliderState({
				...sliderState,
				[slides[activeIndex].id]: currentSlider,
			})
		}
	}


	const handleSlideChange = ({previousIndex, realIndex, autoplay}) => {
		setCurrentIndex(realIndex)

		let prev = infinite && previousIndex > 0 ? previousIndex - 1 : previousIndex
		let previousSlider = sliderState[slides[prev]?.id]
		// if prev slide is video
		if (previousSlider?.url) {
			previousSlider.playing = false
			previousSlider.ended && previousSlider.ref.current?.seekTo(0, "fraction")
			previousSlider.ended = false
			// save player's state : previous
			setSliderState({
				...sliderState,
				[slides[prev].id]: previousSlider,
			})
		}

		let nextSlider = sliderState[slides[realIndex]?.id]
		if (nextSlider?.url) {
			autoplay?.stop()
			setSlideInterval(900)
			nextSlider.playing = true

			// save player's state : next
			setSliderState({
				...sliderState,
				[slides[realIndex].id]: nextSlider,
			})
		} else {
			// drop slideshow interval to default for an image slide
			setSlideInterval(interval)
		}

	}


	return (
		slides?.length > 0 || children
			? (<div className={`carousel-container ${label}`}>
					<Swiper
						ref={carouselRef}
						className={className}
						style={style}
						modules={[Lazy, Pagination, Keyboard, Zoom, Autoplay, Parallax, FreeMode]}
						initialSlide={current}
						pagination={{
							enabled: Boolean(paginationType),
							clickable: true,
							dynamicBullets: true,
							hideOnClick: false,
							type: paginationType
						}}
						preloadImages={false}
						lazy={{
							enabled: true,
							//loadPrevNext: true,
							loadOnTransitionStart: true,
						}}
						keyboard
						parallax={parallax}
						zoom={zoom}
						effect={effect}
						speed={duration}
						autoplay={{
							delay: slideInterval
						}}
						freeMode={{
							enabled: freeScroll,
							//sticky: true,
						}}
						loop={infinite}
						direction={direction}
						breakpoints={responsive}
						//centeredSlides
						grabCursor
						watchOverflow
						autoHeight={autoHeight}
						passiveListeners={false}
						onInit={handleSlideInitialized}
						onSlideChangeTransitionStart={handleSlideChange}
					>
						{children
							? children
							: slides.map(obj => (
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
											<figcaption
												className={`carousel-caption ${showSlideCaption ? "show" : "hide"}`}>
												{label === "lightbox" &&
												<h3 className="title"
												    data-swiper-parallax-opacity="0"
												    data-swiper-parallax="-300"
												    data-swiper-parallax-duration={duration}
												>
													{title}
												</h3>
												}
												<h4 className="subtitle"
												    data-swiper-parallax-opacity="0"
												    data-swiper-parallax="-300"
												    data-swiper-parallax-duration={duration * 1.1}
												>
													{obj.title}
												</h4>
												<p className="excerpt"
												   data-swiper-parallax-opacity="0"
												   data-swiper-parallax="-300"
												   data-swiper-parallax-duration={duration * 1.2}
												>
													{obj.excerpt}
												</p>
											</figcaption>
										}
									</>
									}
									{
										obj.link || obj.video
											? <Player
												sliderRef={carouselRef.current?.swiper}
												id={obj.id}
												playerState={sliderState}
												setPlayerState={setSliderState}
											/>
											: null
									}

								</SwiperSlide>
							))
						}

						{label === "lightbox" && (
							<div className="swiper-fraction">
								<span>{currentIndex + 1}</span>/<span>{slides.length}</span>
							</div>
						)}
					</Swiper>
					{
						width > 576
							? (<>
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
								</>
							) : null
					}
				</div>
			) : null
	)
}


export default Slider


