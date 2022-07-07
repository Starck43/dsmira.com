import {useEffect, useRef, useState} from "react"
import Link from "next/link"
import {Nav} from "react-bootstrap"
import Cover from "../UI/cover"
import {BlockAnimation} from "../UI/animation"
import PostMeta from "./post-meta"

const isBrowser = typeof window !== "undefined"
const Isotope = isBrowser ? window.Isotope || require("isotope-layout") : null
//const imagesloaded = isBrowser ? require('imagesloaded') : null;


const Projects = ({projects, page}) => {
	const isotope = useRef()
	const [filterKey, setFilterKey] = useState("*")

	useEffect(() => {
		isotope.current = new Isotope(".grid", {
			itemSelector: ".project-cover",
			percentPosition: true,
			masonry: {
				columnWidth: ".grid-sizer"
			}
		})

		// cleanup
		return () => isotope?.current.destroy()
	}, [])

	// handling filter key change
	useEffect(() => {
		filterKey === "*"
			? isotope?.current.arrange({filter: `*`})
			: isotope?.current.arrange({filter: `.${filterKey}`})
	}, [filterKey])

	const selectFilterKey = (e) => {
		let key = e.target.dataset.filter

		let filterKeys = e.target.parentNode
		for (let i = 0, len = filterKeys.length; i < len; i++) {
			filterKeys[i].removeAttribute("disabled")
		}
		setFilterKey(key)
	}

	return (
		<section id={projects[0].section}>
			<BlockAnimation as="header" className="title" effect="slideLeft">
				<h2>{projects[0].section_name}</h2>
			</BlockAnimation>
			<Filters projects={projects} filterKey={filterKey} filterClickHandle={selectFilterKey}/>
			<ProjectList items={projects} className={page}/>
		</section>
	)
}

export default Projects

const ProjectList = ({items, className}) => {
	return (
		<div className={`${className} grid`}>
			<div className="grid-sizer"/>
			{items?.length > 0 && items.map((item, i) =>
				item.content.cover && (
					<Link key={item.id} href={item.url} passHref>
						<a id={`project-${item.id}`} className={`project-cover ${item.content.category.slug} mb-2vw`}>
							<BlockAnimation options={{key: i}}>
								<Cover
									src={item.content.cover}
									alt={item.title}
									width={item.content.cover_size.width}
									height={item.content.cover_size.height}
									className="zoom-out"
								/>
							</BlockAnimation>
							<PostMeta {...item.content} className="project-info"/>
						</a>
					</Link>
				))
			}
		</div>
	)
}

const Filters = ({projects, filterKey, filterClickHandle}) => {
	Array.prototype.unique = function () {
		let arr = []
		for (let i = 0; i < this.length; i++) {
			arr[this[i].content.category.slug] = this[i].content.category
		}
		return arr
	}
	const filters = projects.unique()

	return (
		<Nav as={"nav"} className="projects-nav flex-wrap">
			<Nav.Link data-filter="*" disabled={filterKey === "*"} onClick={filterClickHandle}>Все</Nav.Link>
			{Object.keys(filters).map(key => (
				<Nav.Link
					key={key}
					data-filter={filters[key].slug}
					onClick={filterClickHandle}
					disabled={filterKey === key}
				>
					{filters[key].title}
				</Nav.Link>
			))}
		</Nav>
	)
}
