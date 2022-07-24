import Container from "../UI/container"
import {Logo} from "../UI/avatar"
import Menu from "./menu"
import Slider from "../UI/slider"

import theme from "~/styles/theme.module.scss"
import {convertTime2Number} from "../../core/utils"

const INTERVAL = convertTime2Number(theme.sliderAutoplayInterval)

export default function PageHeader({logo, nav, header}) {

	return (
		<header id="home" className="page-header flex-column">
			<Container className="py-4vh">
				<Logo src={logo}/>
				<Menu nav={nav}/>
				{header?.map(section => (
					section?.post_type === "slider" &&
					<Slider
						className="video-slider"
						key={section.id}
						label={section.post_type}
						section={section.section}
						{...section.content}
						interval={INTERVAL}
						duration={1800}
						//infinite
						parallax
						objectFit="contain"
					/>
				))}
			</Container>
		</header>
	)
}
