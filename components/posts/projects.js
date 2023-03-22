import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Nav } from "react-bootstrap"

import PostMeta from "./post-meta"
import Cover from "/components/UI/cover"
import { BlockAnimation } from "/components/UI/animation"

const Isotope = typeof window !== "undefined" ? window.Isotope || require("isotope-layout") : null

const Projects = ({ projects, page }) => {
    const isotope = useRef()
    const [filterKey, setFilterKey] = useState("*")

    useEffect(() => {
        isotope.current = new Isotope(".grid", {
            itemSelector: ".project-cover",
            percentPosition: true,
            masonry: {
                columnWidth: ".grid-sizer",
            },
        })

        // cleanup
        return () => isotope?.current.destroy()
    }, [])

    // handling filter key change
    useEffect(() => {
        filterKey === "*"
            ? isotope?.current.arrange({ filter: `*` })
            : isotope?.current.arrange({ filter: `.${filterKey}` })
    }, [filterKey])

    const selectFilterKey = useCallback((e) => {
        let key = e.target.dataset.filter
        let filterKeys = e.target.parentNode

        for (let i = 0, len = filterKeys.length; i < len; i++) {
            filterKeys[i].removeAttribute("disabled")
        }
        setFilterKey(key)
    }, [])

    return (
        <section id={projects[0].section}>
            <BlockAnimation as="header" className="title" effect="slideLeft">
                <h2>{projects[0].section_name}</h2>
            </BlockAnimation>
            <Filters projects={projects} filterKey={filterKey} sortField="sort" filterClickHandle={selectFilterKey} />
            <ProjectList items={projects} className={page} />
        </section>
    )
}

export default Projects

const ProjectList = ({ items, className }) => {
    return (
        <div className={`${className} grid`}>
            <div className="grid-sizer" />
            {items?.map(
                (item, i) =>
                    item.content.cover?.src && (
                        <Link
                            key={item.id}
                            href={item.url}
                            id={`project-${item.id}`}
                            className={`project-cover ${item.content.category.slug} mb-2vw`}
                        >
                            <BlockAnimation options={{ key: i }}>
                                <Cover
                                    src={item.content.cover.src}
                                    srcset={item.content.cover.srcset}
                                    alt={item.title}
                                    width={item.content.cover.size.width}
                                    height={item.content.cover.size.height}
                                    className="zoom-out"
                                />
                            </BlockAnimation>
                            <PostMeta {...item.content} className="project-info" />
                        </Link>
                    ),
            )}
        </div>
    )
}

const uniqueFilters = (src, sortField) => {
    const obj = src.reduce((acc, val) => {
        let key = val.content.category.id
        return { ...acc, [key]: val.content.category }
    }, {})
    return Object.values(obj).sort((a, b) => a[sortField] || 0 < b[sortField])
}

const Filters = ({ projects, filterKey, sortField, filterClickHandle }) => {
    const filters = uniqueFilters(projects, sortField)
    return (
        <Nav as={"nav"} className="projects-nav flex-wrap">
            <Nav.Link data-filter="*" disabled={filterKey === "*"} onClick={filterClickHandle}>
                Все
            </Nav.Link>
            {filters?.map((obj) => (
                <Nav.Link
                    key={obj.id}
                    data-filter={obj.slug}
                    onClick={filterClickHandle}
                    disabled={filterKey === obj.slug}
                >
                    {obj.title}
                </Nav.Link>
            ))}
        </Nav>
    )
}
