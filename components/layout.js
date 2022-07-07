import React, {Fragment} from 'react'
import Copyright from "./copyright"
import Seo from "./seo"
import {ScrollToTop} from "./UI/links"


export default function Layout({meta, preview, children}) {
	return (
		<Fragment>
			<Seo {...meta}/>
			{children}
			<Copyright src="mailto:webmaster@istarck.ru"/>
			<ScrollToTop url="#home" className="btn btn-primary"/>
		</Fragment>
	)
}
