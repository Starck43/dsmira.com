import Container from '../UI/container'
import Contacts from "./contacts"

export default function PageFooter({contacts}) {
	return (
		<footer className="post-footer">
			<Container>
				<Contacts {...contacts}/>
			</Container>
		</footer>
	)
}
