import React from 'react'
import styled from 'styled-components/macro'
import NotFound from "./NotFound"
import InternalServer from "./InternalServer"
import General from "./General"


const Error = ({statusCode}) => {
    return (
        <Container>
            <Content>{renderError(statusCode)}</Content>
        </Container>
    )
}

const renderError = statusCode => {
    switch (statusCode) {
        case 404:
            return <NotFound/>
        case 500:
            return <InternalServer/>
        default:
        case undefined:
            return <General/>
    }
}


export default Error

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  text-align: center;
  transform: translateY(-50%);
  background-color: white;
`
const Content = styled.div`
  position: relative;
  float: left;
  top: 50%;
  left: 50%;
  max-width: 800px;
  transform: translate(-50%, -50%);
`
