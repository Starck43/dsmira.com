import React, {Fragment, useEffect, useState} from "react"
import {useWindowDimensions} from "../../core/hooks"
import Slider from "../UI/slider"
import Grid from "../UI/grid"
import {LinkButton} from "../UI/links"
import {HtmlContent} from "../UI/html-content"
import LightBox from "../UI/lightbox"


const ProjectDetail = ({id, post_type, page, section, content}) => {
	const {width} = useWindowDimensions()
	const [screen, setScreen] = useState("mobile")
	const [showModal, setShowModal] = useState(false)
	const [imageIndex, setImageIndex] = useState(0)

	const toggleShow = (e) => {
		setShowModal(!showModal)
	}

	const openLightbox = (event) => {
		let current = event.currentTarget
		let slides = current.parentElement.querySelectorAll(".grid-item")
		let index = (slides.length > 0) ? [...slides].indexOf(current) : -1

		setImageIndex(index)
		setShowModal(!showModal)
	}

	useEffect(() => {
		setScreen(width < 992 ? "mobile" : "desktop")
	}, [width])

	return (
		width
			? <Fragment>
				{content.slides.length > 0 &&
				<section id={`project-${id}`} className={`project-detail flex-column centered${screen === "desktop" ? " reverse" : ""} mt-3`}>
					<ProjectMeta {...content} className={screen === "desktop" ? "mt-5" : "mb-5"}/>
					{screen === "desktop"
						? (<Slider {...content} style={{height: width / 1.77}} className={post_type}/>)
						: (
							<>
								<Grid
									images={content.slides}
									container={post_type}
									handleClick={openLightbox}
								/>
								{imageIndex >= 0 &&
								<LightBox
									slides={content.slides}
									currentSlide={imageIndex}
									show={showModal}
									title={content.title}
									excerpt={content.excerpt}
									handleClick={toggleShow}
									className={post_type}
								/>}
							</>
						)
					}
				</section>
				}
				<LinkButton
					title="назад"
					url={`/${page === "self_page" ? section : ""}#project-${id}`}
					arrow="left"
					className="btn btn-primary"
				>Назад</LinkButton>
			</Fragment>
			: null
	)
}

export default ProjectDetail


const ProjectMeta = ({title, description, className}) => (
	<div className={`meta ${className}`}>
		{title && <h3 className="title">{title}</h3>}
		{description && <HtmlContent className="description">{description}</HtmlContent>}
	</div>
)