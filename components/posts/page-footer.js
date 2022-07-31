import Container from "../UI/container"
import Contacts from "./contacts"
import MessageForm from "../forms/message"
import {FEEDBACK_FORM} from "../../core/constants"
import {findObjectInArray} from "../../core/utils"


export default function PageFooter({footer}) {

	const {whatsapp, telegram} = findObjectInArray(footer, "post_type", "contact")?.content

	return (
		<footer className="page-footer">
			<Container className="py-4vh">
				{footer.map(section => section.post_type === "contact" && <Contacts {...section} key={section.id}/>)}
				<MessageForm name="get-in-touch" data={FEEDBACK_FORM} whatsapp={whatsapp} telegram={telegram}/>
			</Container>
		</footer>
	)

}
