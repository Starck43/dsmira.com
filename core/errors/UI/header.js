
import styled from 'styled-components/macro'
import image from '/public/oops.webp'

const Header = ({children}) => {
    return (
        <Container>
            <H1 background={image}>{children}</H1>
        </Container>
    )
}

export default Header


const Container = styled.div`
  height: 280px;
  position: relative;
  z-index: -1;

  @media only screen and (max-width: 768px) {
    height: 142px;
  }
`
const H1 = styled.h1`
  @media only screen and (max-width: 768px) {
    font-size: 112px;
  }

  position: absolute;
  font-size: 230px;
  margin: 0;
  font-weight: 900;
  left: 50%;
  background: url(${props => (props.background)}) no-repeat center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: cover;
  transform: translateX(-50%);
`
