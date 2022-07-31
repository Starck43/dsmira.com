import {cleanDoubleSlashes, removeProtocol} from "../../core/utils"
import {BlockAnimation} from "../UI/animation"
import {HtmlContent} from "../UI/html-content"

import { GrLocationPin as Location} from 'react-icons/gr'
import { GiSmartphone as Phone} from 'react-icons/gi'
import { MdOutlineAlternateEmail as Email} from 'react-icons/md'
import { BsLink45Deg as Web} from 'react-icons/bs'
import { FaWhatsapp as WhatsApp} from 'react-icons/fa'
import { FaTelegramPlane as Telegram} from 'react-icons/fa'
import {TELEGRAM, TELEGRAM_URL, WHATSAPP, WHATSAPP_URL} from "../../core/constants"

//import * as PropTypes from "prop-types"


export default function Contacts({section, content}) {
	return (
		<section id={section}>
			<BlockAnimation as="header" className="title" effect="slideLeft">
				<h2>{content.title}</h2>
			</BlockAnimation>
			<div className="contact">
				{content.name && <h4 className="contact-name mb-3">{content.name}</h4>}
				{content.excerpt && <HtmlContent className="contact-info">{content.excerpt}</HtmlContent>}
				{content.description && <HtmlContent className="contact-description">{content.description}</HtmlContent>}

				{content.location && <div className="contact-location"><Location/><HtmlContent>{content.location}</HtmlContent></div>}
				{content.phone && <div className="contact-phone"><Phone/><a href={`tel:${content.phone}`}>{content.phone}</a></div>}
				{content.email && content.show_email &&
				<div className="contact-email" ><Email/><a href={`mailto:${content.email}`}>{content.email}</a></div>}
				{content.www && <div className="contact-site"><Web/><a href={content.www}>{removeProtocol(content.www)}</a></div>}
				{content.whatsapp && <div className="contact-whatsapp"><WhatsApp/><a href={`${WHATSAPP_URL}?phone=${content.whatsapp}`}>whatsapp</a></div>}
				{content.telegram && <div className="contact-telegram"><Telegram/><a href={cleanDoubleSlashes(`${TELEGRAM_URL}/${content.telegram}`)}>telegram</a></div>}
			</div>
		</section>
	)
}

/*
Contacts.propTypes = {
	phone: PropTypes.string,
	email: PropTypes.string,
}
*/
