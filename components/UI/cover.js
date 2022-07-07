import Image from "next/image"
import {createThumbUrl} from "../../core/utils"
import {useState} from "react"

import style from "~/styles/modules/cover.module.sass"

export default function Cover({src, alt, width = 16, height = 9, layout = "responsive", className = "", style = {}}) {
	const [isLoaded, setLoaded] = useState(false)

	const loadComplete = function (size) {
		setLoaded(true)
		width = size.naturalWidth
		height = size.naturalHeight
	}

	const remoteLoader = ({src, width}) => {
		let breakpoints = [50, 320, 576, 768, 992]
		if (breakpoints.indexOf(width) !== -1)
			return createThumbUrl(src, width)
		return src
	}

	return (
		<Image
			className={`${className} ${style.image} ${isLoaded ? style.show : style.hide}`}
			loader={remoteLoader}
			src={src}
			alt={alt}
			layout={layout}
			width={width}
			height={height}
			quality={80}
			objectFit="cover"
			//unoptimized={true}
			placeholder="blur"
			blurDataURL={createThumbUrl(src, 50)}
			onLoadingComplete={loadComplete}
			style={style}
		/>
	)

}