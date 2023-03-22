import { SwiperSlide } from "swiper/react"

import { Avatar } from "/components/UI/avatar"
import { BlockAnimation } from "/components/UI/animation"
import Slider from "/components/UI/slider"

export default function Customers({ items }) {
    return items?.length > 0 ? (
        <BlockAnimation id={items[0].section} as="section">
            <header className="title">
                <h2>{items[0].section_name}</h2>
            </header>
            <Slider
                className="customers-slider"
                section={items[0].section}
                paginationType={null}
                freeScroll
                responsive={{
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    576: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 40,
                    },
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 50,
                    },
                }}
                objectFit="contain"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id} className="customer centered vertical">
                        <Avatar
                            className="avatar-wrapper zoom-out"
                            src={item.content?.avatar?.src}
                            href={item.content?.link}
                            name={item.title}
                            width={160}
                            rounded
                        />
                        <h4 className="avatar-title">{item.title}</h4>
                    </SwiperSlide>
                ))}
            </Slider>
        </BlockAnimation>
    ) : null
}
