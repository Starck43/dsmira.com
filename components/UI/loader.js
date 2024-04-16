import styled from "styled-components"
import theme from "/styles/theme.module.scss"

export const Loader = () => (
    <LoaderContainer className="loader">
        <Balls color={theme.brandColor}>
            <div className="ball one" />
            <div className="ball two" />
            <div className="ball three" />
        </Balls>
    </LoaderContainer>
)

export default Loader

const LoaderContainer = styled.div`
    position: relative;
    height: 100vh;
    width: 100%;
    opacity: 0;
    animation: fade 300ms ease-in forwards;
    background: white;

    @keyframes fade {
        0% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 1;
        }
    }
`

const Balls = styled.div`
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .ball {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: ${(props) => props.color};
        margin: 0 6px 0 0;
        animation: oscillate 0.7s ease-in forwards infinite;
    }

    .one {
        animation-delay: 0.5s;
    }
    .two {
        animation-delay: 1s;
    }
    .three {
        animation-delay: 2s;
    }

    @keyframes oscillate {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(1.5rem);
        }
        100% {
            transform: translateY(0);
        }
    }
`
