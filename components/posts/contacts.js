import {Fragment} from "react"
import {HtmlContent} from "../UI/html-content"
//import * as PropTypes from "prop-types"


export default function Contacts({phone, email, info}) {
	return (
		<Fragment>
			<div className="phone">{phone}</div>
			<div className="email">{email}</div>
			<HtmlContent className="info">{info}</HtmlContent>
		</Fragment>
	)
}

/*
Contacts.propTypes = {
	phone: PropTypes.string,
	email: PropTypes.string,
}
*/
