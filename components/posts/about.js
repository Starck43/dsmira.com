import { HtmlContent } from "/components/UI/html-content"
import { Avatar } from "/components/UI/avatar"
import Cover from "/components/UI/cover"
import { Fragment } from "react"
import { BlockAnimation } from "/components/UI/animation"

export default function About({ items }) {
    return items?.length > 0 ? (
        <BlockAnimation as="section" id={items[0].section}>
            <header className="title">
                <h2>{items[0].section_name}</h2>
            </header>
            <div className="about flex-column flex-md-wrap flex-md-row">
                {items.map((item) => (
                    <Fragment key={item.id}>
                        {item.content?.avatar && (
                            <Avatar
                                className="about-avatar"
                                src={item.content?.avatar.src}
                                srcset={item.content?.avatar.srcset}
                                width={item.content?.avatar.size?.width || 320}
                                height={item.content?.avatar.size?.height || 320}
                            />
                        )}
                        {(item.content?.excerpt || item.content?.description) && (
                            <div className="about-meta">
                                {item.content.excerpt && <div className="about-excerpt">{item.content.excerpt}</div>}
                                {item.content.description && (
                                    <HtmlContent className="about-description">{item.content.description}</HtmlContent>
                                )}
                            </div>
                        )}
                        {item.content?.file && (
                            <div className="about-extra">
                                <h3 className="title">География заказчиков</h3>
                                <Cover
                                    id={item.content?.file.id}
                                    src={item.content?.file.src}
                                    srcset={item.content?.file.srcset}
                                    width={item.content?.file.size?.width}
                                    height={item.content?.file.size?.height}
                                />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </BlockAnimation>
    ) : null
}
