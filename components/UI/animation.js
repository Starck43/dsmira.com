import styled, { keyframes } from "styled-components"

import { useElementInView } from "/core/hooks"

import style from "~/styles/modules/animation.module.sass"

export const BlockAnimation = ({
    children,
    as = "div",
    id = null,
    className = "",
    options = { key: 1, delay: 0 },
    inview = { margin: "0px", threshold: 0.2 },
    effect = "slideUp",
    handleClick = null,
}) => {
    const [observe, inView] = useElementInView({
        margin: inview.margin,
        threshold: inview.threshold,
        steps: 1,
    })

    return (
        <Component
            as={as}
            ref={observe}
            id={id}
            className={`${className} animation ${inView ? "visible" : "invisible"} ${style[effect]} ${
                style[inView ? "visible" : "invisible"]
            }`}
            onClick={handleClick}
            delay={options.delay > 0 ? options.delay : parseInt(style[`${effect}__delay`], 10) * options.key || 0}
        >
            {children}
        </Component>
    )
}

const Component = styled.div`
    transition-delay: ${(props) => props.delay}ms !important;
`

export const TextAnimation = ({
    children,
    options = {
        duration: 75,
        bound: { x: 0, y: 30, z: 0 },
    },
}) => {
    if (typeof children === "string") {
        let arr = children.replace(/ /g, "\u00a0").split("")
        return (
            <StyledText letterLength={arr.length} duration={options.duration} bound={options.bound}>
                {arr.map((item, i) => (
                    <span key={item + i} style={{ animationDelay: `${options.duration * i}ms` }}>
                        {item}
                    </span>
                ))}
            </StyledText>
        )
    } else return children
}

const animation = ({ x, y, z }) => keyframes`
	0% {
		opacity: 0;
		transform: translate(${x}, ${y}, ${z});
	}
	100% {
		opacity: 1;
		transform: translate(0, 0, 0);
	}
`

const StyledText = styled.span`
    display: inline-block;

    span {
        opacity: 0;
        display: inline-block;
        animation-name: ${(props) => animation(props.bound)};
        animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        animation-fill-mode: forwards;
        // animation-iteration-count: infinite;
        animation-duration: ${(props) => `${props.letterLength * props.duration}ms`};
    }
`
