import React, { useEffect, useRef } from "react"

import { BlockAnimation } from "./animation"
import Cover from "./cover"

const isBrowser = typeof window !== "undefined"
const Masonry = isBrowser ? window.Masonry || require("masonry-layout") : null
const SIZER = "grid-sizer"
const GUTTER = "gutter-sizer"
const ITEM = "grid-item"

const Grid = ({ container, images, handleClick = null }) => {
    const masonry = useRef()

    useEffect(() => {
        masonry.current = new Masonry(`.${container}`, {
            columnWidth: `.${SIZER}`,
            gutter: `.${GUTTER}`,
            itemSelector: `.${ITEM}`,
            percentPosition: true,
        })
        return () => masonry?.current.destroy()
    }, [container])

    return (
        masonry &&
        images?.length > 0 && (
            <div className={`${container} grid`} onClick={handleClick}>
                <div className={SIZER} />
                <div className={GUTTER} />
                {images?.map(
                    (obj, index) =>
                        obj.file && (
                            <BlockAnimation
                                key={obj.id}
                                id={`slide-${obj.id}`}
                                className={`${ITEM} ${
                                    obj.size?.height > 0 && obj.size?.width / obj.size?.height < 1
                                        ? "portrait"
                                        : "landscape"
                                }`}
                            >
                                <Cover
                                    id={index}
                                    src={obj.src}
                                    srcset={obj.srcset}
                                    alt={obj.title || obj.excerpt}
                                    title={obj.title || obj.excerpt}
                                    width={obj.size?.width}
                                    height={obj.size?.height}
                                    layout="responsive"
                                    style={handleClick && { cursor: "pointer" }}
                                />
                            </BlockAnimation>
                        ),
                )}
            </div>
        )
    )
}

export default Grid
