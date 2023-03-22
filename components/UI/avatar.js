import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createSrcSet, shimmer, toBase64 } from "/core/utils"

import { HEADER } from "/core/constants"
import style from "~/styles/modules/avatar.module.sass"

export const Logo = ({
    href = "/",
    src,
    srcset = null,
    name = "",
    width = null,
    height = null,
    rounded = true,
    className = "logo",
}) => {
    const [imageSize, setImageSize] = useState({
        naturalWidth: 160,
        naturalHeight: 160,
    })

    const loadComplete = function (imageDimension) {
        setImageSize(imageDimension)
    }

    return (
        <Link href={href} className={`${className} ${rounded ? style.rounded : ""}`}>
            <Image
                src={HEADER?.logo || src}
                alt={name}
                layout="responsive"
                width={width || imageSize.naturalWidth}
                height={height || imageSize.naturalHeight}
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer("#a6a6a6", imageSize.naturalWidth, imageSize.naturalHeight, rounded),
                )}`}
                placeholder="blur"
                onLoadingComplete={!width && !height && loadComplete}
                unoptimized
            />
        </Link>
    )
}

export const Avatar = ({
    src,
    srcset = null,
    href = null,
    name = "",
    width = 160,
    height = null,
    rounded = false,
    className = "centered vertical",
}) => {
    const thumb = srcset ? srcset[0] : src
    const Tag = href ? "a" : "div"
    return (
        <Tag
            href={href}
            className={`${className} ${style.div} ${rounded ? style.rounded : ""} ${!src ? style.emptyWrapper : ""}`}
        >
            {src && (
                <Image
                    src={thumb}
                    srcset={createSrcSet(srcset)}
                    alt={name}
                    width={width}
                    height={height ? height : width}
                    placeholder="blur"
                    //blurDataURL={createThumbUrl(src, 50)}
                    blurDataURL={
                        srcset
                            ? thumb
                            : `data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", width, height, rounded))}`
                    }
                    unoptimized
                />
            )}
        </Tag>
    )
}
