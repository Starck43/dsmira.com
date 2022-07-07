import Link from "next/link"
import React, {useEffect} from "react"
import {useScrollPosition} from "../../core/hooks"
import {smoothScroll} from "../../core/utils"


export const LinkButton = ({children, url="#", title = "", arrow = "", className = null}) => {
	return (
		<Link href={url} scroll={false} shallow>
			<button className={`link ${children ? "with-label" : ""} ${className}`} title={title}>
				{arrow && arrow !== "right" && <div className={`arrow ${arrow}`}/>}
				{children && <span>{children}</span>}
				{arrow && arrow === "right" && <div className={`arrow ${arrow}`}/>}
			</button>
		</Link>
	)
}

export const ScrollToTop = ({url, className = ""}) => {

	const scroll = (typeof window !== "undefined")
		? useScrollPosition(document.documentElement, window.innerHeight)
		: {position: 0, reachedTarget: false}

	const scrollToRef = () => {
		let ref = document.querySelector(url)
		smoothScroll(ref)
	}

	return (
		<div id="scrollToTop" className={`${scroll.reachedTarget ? "visible" : "invisible"} ${className}`} onClick={scrollToRef}>
			<LinkButton arrow="up" title="вверх" className={`scroll-up btn btn-primary`}>
				вверх
			</LinkButton>
		</div>
	)
}
