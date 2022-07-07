import React, {useEffect, useRef} from "react"

import {BlockAnimation} from "./animation"
import Cover from "./cover"

const isBrowser = typeof window !== "undefined"
const Masonry = isBrowser ? window.Masonry || require("masonry-layout") : null


const Grid = ({container, slideName="grid-item", images, handleClick=null}) => {
	const masonry = useRef()
	let grid = "grid-sizer"
	let gutter = "gutter-sizer"

	useEffect(() => {
		masonry.current = new Masonry(`.${container}`, {
			columnWidth: `.${grid}`,
			gutter: `.${gutter}`,
			itemSelector: `.${slideName}`,
			percentPosition: true,
		})
		return () => masonry?.current.destroy()
	}, [])

	return (
		masonry && images?.length > 0 && (
			<div className={`${container} grid`}>
				<div className={grid}/>
				<div className={gutter}/>
				{images?.map(obj => (
					obj.file &&
					<BlockAnimation
						key={obj.id}
						id={`slide-${obj.id}`}
						className={`${slideName} ${obj.height > 0 && obj.width / obj.height < 1 ? "portrait" : "landscape"}`}
						handleClick={handleClick}
					>
						<Cover
							src={obj.file}
							alt={obj.title || obj.excerpt}
							title={obj.title || obj.excerpt}
							width={obj.width}
							height={obj.height}
							layout="responsive"
							style={handleClick && {cursor:"pointer"}}
						/>
					</BlockAnimation>
				))}
			</div>
		)
	)
}

export default Grid