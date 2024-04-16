import { useState } from "react"
import Image from "next/legacy/image"
import { createSrcSet, shimmer, toBase64 } from "/core/utils"

import styles from "/styles/modules/cover.module.sass"

export default function Cover({
    id = null,
    src,
    srcset = null,
    alt,
    width = 16,
    height = 9,
    layout = "responsive",
    className = "",
    style = {},
}) {
    const [isLoaded, setLoaded] = useState(false)

    const thumb = srcset?.[0] || src

    const loadComplete = function () {
        setLoaded(true)
    }

    return (
        <Image
            id={id}
            className={`${className} ${styles.image} ${isLoaded ? styles.show : styles.hide}`}
            //loader={remoteLoader}
            src={isLoaded ? src : thumb}
            srcset={createSrcSet(srcset)}
            alt={alt}
            layout={layout}
            width={width}
            height={height}
            objectFit="cover"
            placeholder="blur"
            quality={80}
            blurDataURL={srcset ? thumb : `data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", width, height))}`}
            onLoadingComplete={loadComplete}
            unoptimized
            style={style}
        />
    )
}
