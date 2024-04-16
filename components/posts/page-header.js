import Menu from "./menu"
import Container from "/components/UI/container"
import { Logo } from "/components/UI/avatar"
import Slider from "/components/UI/slider"
import { convertTime2Number } from "/core/utils"

import theme from "/styles/theme.module.scss"

const INTERVAL = convertTime2Number(theme.sliderAutoplayInterval)

export default function PageHeader({ logo, nav, header }) {
    return (
        <header id="home" className="page-header flex-column">
            <Container className="py-4vh">
                <Logo src={logo} />
                <Menu nav={nav} />
                {header?.map(
                    (section) =>
                        section.post_type === "slider" && (
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
                        ),
                )}
            </Container>
        </header>
    )
}
