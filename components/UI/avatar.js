import {useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {createSrcSet, createThumbUrl, shimmer, toBase64} from "../../core/utils"

import {HEADER} from "../../core/constants"
import style from "~/styles/modules/avatar.module.sass"
import styled from "styled-components"


export const Logo = ({
	                     className = "logo",
	                     name = "",
	                     src,
	                     srcset = null,
	                     width = null,
	                     height = null,
	                     rounded = true,
	                     href = "/"
                     }) => {

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
					src={HEADER?.logo || src}
					alt={name}
					layout="responsive"
					width={width || imageSize.naturalWidth}
					height={height || imageSize.naturalHeight}
					blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", imageSize.naturalWidth, imageSize.naturalHeight, rounded))}`}
					placeholder="blur"
					onLoadingComplete={!width && !height && loadComplete}
					unoptimized
				/>
			</a>
		</Link>
	)
}


export const Avatar = ({
	                       className = "centered vertical",
	                       src,
	                       srcset = null,
	                       href = null,
	                       name = "",
	                       width = 160,
	                       height = null,
	                       rounded = false,
                       }) => {

	const thumb = srcset ? srcset[0] : src

	return (
		<Wrapper as={href ? "a" : "div"} href={href}
		         className={`${className} ${style.wrapper} ${rounded ? style.rounded : ""} ${!src ? style.emptyWrapper : ""}`}>
			{src &&
			<Image
				src={thumb}
				srcset={createSrcSet(srcset)}
				alt={name}
				width={width}
				height={height ? height : width}
				placeholder="blur"
				//blurDataURL={createThumbUrl(src, 50)}
				blurDataURL={srcset ? thumb : `data:image/svg+xml;base64,${toBase64(shimmer("#a6a6a6", width, height, rounded))}`}
				unoptimized
			/>
			}
		</Wrapper>
	)
}

const Wrapper = styled.div``
