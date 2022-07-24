import React from "react"
import ReactPlayer from "react-player/lazy"
import ProgressBar from "react-bootstrap/ProgressBar"
import {addClassToElements} from "../../core/utils"


const Player = ({sliderRef, id, playerState, setPlayerState}) => {

	const handleOnStart = () => {
		// toggle "loaded" class for smooth player appearing for the first time
		addClassToElements("loaded", `[data-player-id="${id}"]`, sliderRef?.el)
	}


	const handleOnPlay = () => {
		let newState = playerState[id]

		if (!newState.playing) {
			newState.playing = true

			setPlayerState({
				...playerState,
				[id]: newState,
			})
		}
	}


	const handleOnPause = () => {
		let newState = playerState[id]

		if (newState.playing) {
			newState.playing = false

			setPlayerState({
				...playerState,
				[id]: newState,
			})
		}
	}


	const handleProgress = (state) => {
		let newState = playerState[id]

		// detect video position before a second to ending
		let elapsed = newState.ref?.current.getDuration() - newState.ref?.current.getCurrentTime()
		if (!newState.ended && elapsed <= 1) {
			newState.ended = true
			// go to the next slide 
			sliderRef.autoplay?.start()
		}

		newState.played = state.played
		newState.loaded = state.loaded

		setPlayerState({
			...playerState,
			[id]: newState,
		})

	}


	return (
		ReactPlayer.canPlay(playerState[id].url) &&
		<div className="player" data-player-id={id}>
			<ProgressBar>
				<ProgressBar now={playerState[id].played * 100} bsPrefix="played"/>
				<ProgressBar
					now={(playerState[id].loaded - playerState[id].played) * 100}
					bsPrefix="loaded"/>
			</ProgressBar>
			<ReactPlayer
				ref={playerState[id].ref}
				className={`react-player`}
				url={playerState[id].url}
				width="100%"
				height="100%"
				volume={0.6}
				muted
				loop
				playing={playerState[id].playing}
				onStart={handleOnStart}
				onPlay={handleOnPlay}
				onPause={handleOnPause}
				onProgress={handleProgress}
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
						}
					}
				}}
			/>
		</div>
	)
}

export default Player