import {HtmlContent} from "../UI/html-content"
import {Avatar} from "../UI/avatar"
import Cover from "../UI/cover"
import {Fragment} from "react"
import {BlockAnimation} from "../UI/animation"

export default function About({items}) {
	return (
		items?.length > 0 ?
			<BlockAnimation as="section" id={items[0].section}>
				<header className="title">
					<h2>{items[0].section_name}</h2>
				</header>
				<div className="about flex-column flex-md-wrap flex-md-row">
					{items.map(item => (
						<Fragment key={item.id}>
							{item.content.avatar &&
							<Avatar
								className="about-avatar"
								src={item.content.avatar}
								width={item.content.avatar_size?.width || 320}
								height={item.content.avatar_size?.height || 320}
							/>}
							<div className="about-meta">
								{item.content.excerpt && <div className="about-excerpt">{item.content.excerpt}</div>}
								{item.content.description &&
								<HtmlContent className="about-description">{item.content.description}</HtmlContent>}
							</div>
							{item.content.file &&
							<div className="about-extra">
								<h3 className="title">География заказчиков</h3>
								<Cover
									src={item.content.file}
									width={item.content.file_size.width}
									height={item.content.file_size.height}
								/>
							</div>
							}
						</Fragment>
					))}
				</div>
			</BlockAnimation>
			: null
	)
}