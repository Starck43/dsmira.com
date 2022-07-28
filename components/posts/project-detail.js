import React, {Fragment, useState} from "react"
import {useWindowDimensions} from "../../core/hooks"
import Slider from "../UI/slider"
import Grid from "../UI/grid"
import {LinkButton} from "../UI/links"
import {HtmlContent} from "../UI/html-content"
import LightBox from "../UI/lightbox"

import styles from "~/styles/modules/projects.module.sass"


const ProjectDetail = ({id, post_type, page, section, content}) => {
	const {ratio} = useWindowDimensions(null)
	const [imageIndex, setImageIndex] = useState(0)

	const openLightbox = (e) => {
		setImageIndex(parseInt(e.target.id, 10) + 1)
	}


	return (
		ratio
			? <Fragment>
				{content.slides.length > 0 &&
				<section
					id={`project-${id}`}
					className={`project-detail flex-column centered${ratio > 1 ? " reverse" : ""}`}
					style={{position: "relative"}}
				>
					<ProjectMeta
						className={ratio > 1 ? "mt-5" : "mb-5"}
						styles={styles}
						{...content}
					/>
					{ratio > 1
						? (
							<Slider
								className={post_type}
								{...content}
								infinite
								parallax
								//zoom
								//autoHeight
							/>
						)
						: (
							<>
								<Grid
									images={content.slides}
									handleClick={openLightbox}
									container={post_type}
								/>

								{imageIndex > 0 &&
								<LightBox
									className={post_type}
									slides={content.slides}
									title={content.title}
									excerpt={content.excerpt}
									show={Boolean(imageIndex)}
									handleClose={() => setImageIndex(0)}
									currentSlide={imageIndex - 1}
								/>
								}
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


const ProjectMeta = ({title, description, className="", styles}) => (
	<div className={`meta ${className}`}>
		{title && <h3 className={`title ${styles.title}`}>{title}</h3>}
		{description && <HtmlContent className={`description ${styles.description}`}>{description}</HtmlContent>}
	</div>
)