import React, { Fragment } from "react"

import { Button } from "react-bootstrap"
import { Header, Title, Description } from "./UI"

const Layout = ({ title, description }) => (
    <Fragment>
        <Header>Что-то пошло нет так...</Header>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Button variant="warning" onClick={() => window.location.reload()}>
            На главную
        </Button>
    </Fragment>
)

export default Layout
