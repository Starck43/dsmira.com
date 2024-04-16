import React, { createRef, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Zoom, Autoplay, Parallax, FreeMode, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/zoom";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/parallax";
import "swiper/css/free-mode";

import Player from "./player";

import { useWindowDimensions } from "/core/hooks";
import Cover from "./cover";

const Slider = ({
                  title,
                  slides = [],
                  current = 0,
                  interval = 0,
                  duration = 900,
                  infinite = false,
                  direction = "horizontal",
                  autoHeight = false,
                  centered = false,
                  responsive = null,
                  effect = "creative",
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
  const carouselRef = useRef(null);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(current);
  const [showSlideCaption, setShowSlideCaption] = useState(true);
  const [slideInterval, setSlideInterval] = useState(interval);
  const [sliderState, setSliderState] = useState(
    slides?.reduce((acc, value) => {
      acc[value.id] = {
        ref: createRef(),
        id: value.id,
        url: value.video || value.link || null,
        loaded: 0,
        played: 0,
        playing: false,
        ended: false
      };
      return acc;
    }, {})
  );

  const handlePrev = () => {
    carouselRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    carouselRef.current?.swiper.slideNext();
  };

  const handleSlideInitialized = ({ slides, activeIndex, autoplay }) => {
    // adding Zoom class to images' containers
    // label === "lightbox" && slides.forEach(obj => {
    //   let img = obj.querySelector("img");
    //   img && img.parentElement.classList.add("swiper-zoom-container");
    // });

    let currentSlider = sliderState[slides[activeIndex]?.id];
    if (currentSlider?.url) {
      autoplay?.stop();
      setSlideInterval(900);

      currentSlider.playing = true;

      // save player's state
      setSliderState({
        ...sliderState,
        [slides[activeIndex].id]: currentSlider
      });
    }
  };

  const handleSlideChange = ({ previousIndex, realIndex, autoplay }) => {
    setCurrentIndex(realIndex);

    let prev = infinite && previousIndex > 0 ? previousIndex - 1 : previousIndex;
    let previousSlider = sliderState[slides[prev]?.id];
    // if prev slide is video
    if (previousSlider?.url) {
      previousSlider.playing = false;
      previousSlider.ended && previousSlider.ref.current?.seekTo(0, "fraction");
      previousSlider.ended = false;
      // save player state : previous
      setSliderState({
        ...sliderState,
        [slides[prev].id]: previousSlider
      });
    }

    let nextSlider = sliderState[slides[realIndex]?.id];
    if (nextSlider?.url) {
      autoplay?.stop();
      setSlideInterval(900);
      nextSlider.playing = true;

      // save player state : next
      setSliderState({
        ...sliderState,
        [slides[realIndex].id]: nextSlider
      });
    } else {
      // drop slideshow interval to default for an image slide
      interval > 0 && setSlideInterval(interval);
    }
  };

  return slides?.length > 0 || children ? (
    <div className={`carousel-container ${label}`}>
      <Swiper
        ref={carouselRef}
        className={className}
        style={style}
        modules={[Pagination, Keyboard, EffectCreative, Zoom, Autoplay, Parallax, FreeMode]}
        initialSlide={current}
        pagination={{
          enabled: Boolean(paginationType) && slides.length > 1,
          clickable: true,
          dynamicBullets: true,
          hideOnClick: false,
          type: paginationType
        }}
        preloadImages={false}
        keyboard
        parallax={parallax}
        zoom={{
          enabled: zoom,
          maxRatio: 2.5
        }}
        effect={effect}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        speed={duration}
        autoplay={{
          enabled: Boolean(interval),
          delay: slideInterval
        }}
        freeMode={{
          enabled: freeScroll
          //sticky: true,
        }}
        loop={infinite}
        direction={direction}
        breakpoints={responsive}
        centeredSlides={centered}
        grabCursor
        watchOverflow
        autoHeight={autoHeight}
        passiveListeners={false}
        onInit={handleSlideInitialized}
        onSlideChangeTransitionStart={handleSlideChange}
      >
        {children
          ? children
          : slides.map((obj) => (
            <SwiperSlide key={obj.id} onClick={() => setShowSlideCaption(!showSlideCaption)}>
              {obj.file && (
                <span className={zoom ? "swiper-zoom-container" : "img-wrapper"}>
                                      <Cover
                                        className={zoom ? "swiper-zoom-target" : ""}
                                        src={obj.srcset.length > 0 ? obj.srcset[0] : obj.src}
                                        //src={obj.src}
                                        srcset={obj.srcset}
                                        alt={obj.title}
                                        width={obj.size?.width}
                                        height={obj.size?.height}
                                        style={{"objectFit": objectFit}}
                                      />

                                      <div className="swiper-lazy-preloader" />

                  {(obj.title || obj.excerpt) && (
                    <figcaption
                      className={`carousel-caption ${showSlideCaption ? "show" : "hide"}`}
                    >
                      {label === "lightbox" && (
                        <h3
                          className="title"
                          data-swiper-parallax-opacity="0"
                          data-swiper-parallax="-300"
                          data-swiper-parallax-duration={duration}
                        >
                          {title}
                        </h3>
                      )}
                      <h4
                        className="subtitle"
                        data-swiper-parallax-opacity="0"
                        data-swiper-parallax="-300"
                        data-swiper-parallax-duration={duration * 1.1}
                      >
                        {obj.title}
                      </h4>
                      <p
                        className="excerpt"
                        data-swiper-parallax-opacity="0"
                        data-swiper-parallax="-300"
                        data-swiper-parallax-duration={duration * 1.2}
                      >
                        {obj.excerpt}
                      </p>
                    </figcaption>
                  )}
                </span>
              )}
              {obj.link || obj.video ? (
                <Player
                  sliderRef={carouselRef.current?.swiper}
                  id={obj.id}
                  playerState={sliderState}
                  setPlayerState={setSliderState}
                />
              ) : null}
            </SwiperSlide>
          ))}

        {label === "lightbox" && (
          <div className="swiper-fraction">
            <span>{currentIndex + 1}</span>/<span>{slides.length}</span>
          </div>
        )}
      </Swiper>
      {width > 576 ? (
        <>
          <div
            className={`swiper-control-next ${
              (!infinite && carouselRef.current?.swiper.isEnd) ||
              carouselRef.current?.swiper.zoom?.scale > 1
                ? "disabled"
                : ""
            }`}
            onClick={handleNext}
          >
            <span className={`arrow right`} />
          </div>
          <div
            className={`swiper-control-prev ${
              (!infinite && carouselRef.current?.swiper.isBeginning) ||
              carouselRef.current?.swiper.zoom?.scale > 1
                ? "disabled"
                : ""
            }`}
            onClick={handlePrev}
          >
            <span className={`arrow left`} />
          </div>
        </>
      ) : null}
    </div>
  ) : null;
};

export default Slider;
