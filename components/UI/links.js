import React, { useCallback, useMemo } from "react"
import Link from "next/link"
import { useScrollPosition } from "/core/hooks"
import { smoothScroll } from "/core/utils"

export const LinkButton = ({ children, url = null, title = "", arrow = "", className = null }) => {
    const buttonElement = useMemo(
        () => (
            <button className={`link ${children ? "with-label" : ""} ${className}`} title={title}>
                {arrow && arrow !== "right" && <div className={`arrow ${arrow}`} />}
                {children && <span>{children}</span>}
                {arrow && arrow === "right" && <div className={`arrow ${arrow}`} />}
            </button>
        ),
        [arrow, children, className, title],
    )

    return url ? (
        <Link href={url} scroll={false} shallow>
            {buttonElement}
        </Link>
    ) : (
        buttonElement
    )
}

export const ScrollToTop = ({ url, className = "" }) => {
    const scroll = useScrollPosition(document.documentElement, window.innerHeight)

    const scrollToRef = useCallback(() => {
        let ref = document.querySelector(url)
        smoothScroll(ref)
    }, [url])

    return (
        <div
            id="scrollToTop"
            className={`${scroll.reachedTarget ? "visible" : "invisible"} ${className}`}
            onClick={scrollToRef}
        >
            <LinkButton arrow="up" title="вверх" className={`scroll-up btn btn-primary`}>
                вверх
            </LinkButton>
        </div>
    )
}
