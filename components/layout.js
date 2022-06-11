import {Fragment} from 'react'
import Copyright from "./copyright"
import Seo from "./seo"


export default function Layout({meta, preview, children}) {
	return (
		<Fragment>
			<Seo {...meta}/>
			{children}
			<Copyright src="mailto:webmaster@istarck.ru"/>
		</Fragment>
	)
}
