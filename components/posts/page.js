import { Fragment } from "react"

import PageHeader from "./page-header"
import PageBody from "./page-body"
import PageFooter from "./page-footer"

export default function Page({ nav, header, body, footer, meta, page }) {
    return (
        <Fragment>
            <PageHeader page={page} logo={meta.logo} nav={nav} header={header} />
            <PageBody page={page} body={body} />
            <PageFooter footer={footer} />
        </Fragment>
    )
}
