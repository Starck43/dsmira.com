import {useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {createThumbUrl, shimmer, toBase64} from "../../core/utils"

import {HEADER} from "../../core/constants"
import style from "~/styles/modules/avatar.module.sass"
import styled from "styled-components"


const remoteLoader = ({src, width}) => {
	let breakpoints = [50, 320, 450]
	if (breakpoints.indexOf(width) !== -1)
		return createThumbUrl(src, width)
	return src
}

export const Logo = ({className = "logo", name = "", src, width = null, height = null, rounded = true, href = "/"}) => {

	const [imageSize, setImageSize] = useState({
		naturalWidth: 160,
		naturalHeight: 160
	})

	const loadComplete = function (imageDimension) {
		setImageSize(imageDimension)
	}

	return (
		<Link href={href} passHref>
			<a className={`${className} ${rounded ? style.rounded : ""}`}>
				<Image
					src={HEADER.logo || src}
					alt={name}
					//loader={remoteLoader}
					layout="responsive"
					width={width || imageSize.naturalWidth}
					height={height || imageSize.naturalHeight}
					unoptimized={true}
					//blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", imageSize.naturalWidth, imageSize.naturalHeight, rounded))}`}
					//placeholder="blur"
					onLoadingComplete={loadComplete}
				/>
			</a>
		</Link>
	)
}

export const Avatar = ({
	                       className = "centered vertical",
	                       src,
	                       href = null,
	                       name = "",
	                       width = 160,
	                       height = null,
	                       rounded = false,
                       }) => {

	return (
		<Wrapper as={href ? "a": "div"} href={href}
			className={`${className} ${style.wrapper} ${rounded ? style.rounded : ""} ${!src ? style.emptyWrapper : ""}`}>
			{src &&
			<Image
				src={src}
				loader={remoteLoader}
				alt={name}
				width={width}
				height={height ? height : width}
				unoptimized={true}
				placeholder="blur"
				//blurDataURL={createThumbUrl(src, 50)}
				blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", width, height, rounded))}`}
			/>
			}
		</Wrapper>
	)
}


const Wrapper = styled.div`
`
