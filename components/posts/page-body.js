
import Container from "../UI/container"
import About from "./about"
import Customers from "./customers"
import Works from "./works"
import Projects from "./projects"
import ProjectDetail from "./project-detail"


export default function PageBody({body, page}) {
	return (
		<main className="main">
			<Container className="pb-4">
				{page === "home" && (<>
					<Works items={body.works}/>
					<About items={body.about}/>
					<Customers items={body.customers}/>
				</>)}
				{page === "projects" && <Projects page={page} projects={body.projects}/>}
				{page === "project-detail" && <ProjectDetail page={page} {...body}/>}
			</Container>
		</main>
	)
}
