import Link from "next/link"
import { Row } from "react-bootstrap"

import Cover from "/components/UI/cover"
import { BlockAnimation } from "/components/UI/animation"
import PostMeta from "./post-meta"

export default function Works({ items }) {
    return items?.length > 0 ? (
        <section id={items[0].section}>
            <BlockAnimation as="header" className="title" effect="slideLeft">
                <h2>{items[0].section_name}</h2>
            </BlockAnimation>

            <Row xs={1} sm={2} md={3} className="works-list g-5">
                {items.map((item, i) => (
                    <BlockAnimation key={item.id} className="col" inview={{ threshold: 0.1 }} options={{ key: i }}>
                        <Link href={item.url} id={`project-${item.id}`} className="work">
                            <Cover
                                id={item.content.cover?.id}
                                src={item.content.cover?.src}
                                srcset={item.content.cover?.srcset}
                                alt={item.title}
                                width={450}
                                height={253}
                                className="zoom-out"
                            />
                            <PostMeta {...item.content} className="work-info" />
                        </Link>
                    </BlockAnimation>
                ))}
            </Row>
            <Link href="/projects">
                <button className="projects-link btn btn-primary mt-4">Все проекты</button>
            </Link>
        </section>
    ) : null;
}
