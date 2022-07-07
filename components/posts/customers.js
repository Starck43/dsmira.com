//import Link from "next/link"
import Carousel from "nuka-carousel"
import {
	BsChevronLeft as ArrowLeftIcon,
	BsChevronRight as ArrowRightIcon
} from "react-icons/bs"
import {useWindowDimensions} from "../../core/hooks"
import {Avatar} from "../UI/avatar"
import {BlockAnimation} from "../UI/animation"
import {useEffect, useState} from "react"


export default function Customers({items}) {
	const {width, media} = useWindowDimensions()
	const [slidesToShow, setSlidesToShow] = useState(0)

	useEffect(()=> {
		switch (media) {
			case "md" : setSlidesToShow(2); break
			case "lg" : setSlidesToShow(3); break
			case "xl" : setSlidesToShow(4); break
			case "xxl": setSlidesToShow(5); break
			default: setSlidesToShow(2);
		}
	},[media])

	return (
		items?.length > 0 && slidesToShow > 0 ?
			<BlockAnimation id={items[0].section} as="section">
				<header className="title">
					<h2>{items[0].section_name}</h2>
				</header>
				<Carousel
					className="customers-slider"
					frameAriaLabel="customers-slider"
					slidesToShow={slidesToShow}
					withoutControls={width < 576}
					renderBottomCenterControls={() => null}
					renderTopCenterControls={() => null}
					defaultControlsConfig={{
						nextButtonText: " ",
						prevButtonText: " ",
						prevButtonClassName: "arrow left",
						nextButtonClassName: "arrow right",
					}}
				>
					{items.map(item => (
						<a key={item.id} className="customer centered vertical" href={item.content.link}>
							<Avatar src={item.content?.avatar} name={item.title} width={300} rounded={true} className="avatar-wrapper zoom-out"/>
							<h4 className="avatar-title">{item.title}</h4>
						</a>
					))}
				</Carousel>
			</BlockAnimation>
			: null
	)
}
