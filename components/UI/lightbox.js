import React from "react"
import {Modal, CloseButton} from "react-bootstrap"
import Slider from "./slider"


const LightBox = ({slides, currentSlide, title, excerpt, show, handleClose, className}) => {
	return (
		<Modal
			contentClassName="carousel-content"
			dialogClassName="carousel"
			centered
			fullscreen
			scrollable={false}
			backdrop={false}
			show={show}
			onHide={handleClose}
		>
			<Slider
				label="lightbox"
				className={className}
				current={currentSlide}
				title={title}
				excerpt={excerpt}
				slides={slides}
				parallax
				infinite
				zoom
			/>
			<CloseButton className="" onClick={handleClose}/>
		</Modal>
	)
}

export default LightBox


