import Container from "../UI/container"
import Events from "./events"

import Customers from "./customers"


export default function PageBody({clients}) {
	return (
		<main className="post">
			<Container className="py-4vh flex-wrap">
				<Events events={events}/>
				<section className="partners-forum cell-auto">
					<h3>Клиенты</h3>
					<Customers className="partner-names" clients={clients} fields={['name']}/>
				</section>
				<section className="contacts-forum cell-auto">
				</section>
			</Container>
		</main>
	)
}
