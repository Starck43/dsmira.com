import Head from "next/head"
import {Fragment} from "react"

import PageHeader from "./page-header"
import PageBody from "./page-body"
import PageFooter from "./page-footer"

import DATA, {SITE_NAME} from "../../core/constants"


export default function Page({nav, header, body, footer}) {
	return (
		<Fragment>
			<PageHeader logo={DATA.logo} header={header}/>
{/*			<PostBody {...post}/>
			<PostFooter contacts={post}/>*/}
		</Fragment>
	)
}
