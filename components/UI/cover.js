import {useState} from "react"
import Image from "next/image"
//import {createThumbUrl} from "../../core/utils"

import styles from "~/styles/modules/cover.module.sass"
import {createSrcSet, shimmer, toBase64} from "../../core/utils"


export default function Cover({id=null, src, srcset=null, alt, width = 16, height = 9, layout = "responsive", className = "", style = {}}) {
	const [isLoaded, setLoaded] = useState(false)

	const thumb = srcset ? srcset[0] : src

	const loadComplete = function (size) {
		setLoaded(true)
	}

	return (
		<Image
			id={id}
			className={`${className} ${styles.image} ${isLoaded ? styles.show : styles.hide}`}
			//loader={remoteLoader}
			src={thumb}
			srcset={createSrcSet(srcset)}
			alt={alt}
			layout={layout}
			width={width}
			height={height}
			quality={80}
			objectFit="cover"
			placeholder="blur"
			blurDataURL={srcset ? thumb : `data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", width, height))}`}
			onLoadingComplete={loadComplete}
			unoptimized
			style={style}
		/>
	)

}