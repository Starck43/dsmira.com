import React from "react"

import {Modal, CloseButton} from "react-bootstrap"
import Slider from "./slider"


const LightBox = ({slides, currentSlide, title, excerpt, show, handleClick, className}) => {
	return (
		<Modal
			contentClassName="carousel-content"
			dialogClassName="carousel-modal"
			centered
			fullscreen
			scrollable={false}
			show={show}
			onHide={handleClick}
		>
			<Modal.Body>
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
			</Modal.Body>

			<CloseButton className="" onClick={handleClick}/>

		</Modal>
	)
}

export default LightBox


