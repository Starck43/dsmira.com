import React from "react"

import {Modal, CloseButton} from "react-bootstrap"
import Slider from "./slider"


const LightBox = ({slides, currentSlide, title, excerpt, show, handleClick, className}) => {
	return (
		<Modal
			show={show}
			onHide={handleClick}
			centered={true}
			fullscreen={true}
			scrollable={false}
			contentClassName="carousel-content"
			dialogClassName="carousel-modal"
		>
			<Modal.Body>
				<Slider label="lightbox"
				        slides={slides}
				        current={currentSlide}
				        title={title}
				        excerpt={excerpt}
				        className={className}
				/>
			</Modal.Body>

			<CloseButton variant="white" className="" onClick={handleClick}/>

		</Modal>
	)
}

export default LightBox


