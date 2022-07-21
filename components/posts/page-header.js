import Container from "../UI/container"
import {Logo} from "../UI/avatar"
import Menu from "./menu"
import Slider from "../UI/slider"

import theme from "~/styles/theme.module.scss"
import {convertTime2Number} from "../../core/utils"


export default function PageHeader({logo, nav, header}) {
	let interval = convertTime2Number(theme.sliderAutoplayInterval)

	return (
		<header id="home" className="page-header flex-column">
			<Container className="py-4vh">
				<Logo src={logo}/>
				<Menu nav={nav}/>
				{header?.map(section => (
					section?.post_type === "slider" &&
					<Slider key={section.id}
					        label={section.post_type}
					        section={section.section}
					        {...section.content}
					        interval={interval}
					        duration={1800}
					        infinite={false}
					        objectFit="contain"
					        className="video-slider"
					/>
				))}
			</Container>
		</header>
	)
}
