import Container from "../UI/container"
import Contacts from "./contacts"
import MessageForm from "../messsages/message"
import {FEEDBACK_FORM} from "../../core/constants"


export default function PageFooter({footer}) {
	return (
		<footer className="page-footer">
			<Container className="py-4vh">
				{footer.map(section => (
					section.post_type === "contact" && <Contacts {...section} key={section.id}/>
				))}
				<MessageForm formName="get-in-touch" formData={FEEDBACK_FORM}/>
			</Container>
		</footer>
	)
}
