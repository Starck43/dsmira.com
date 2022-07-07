import {Nav} from "react-bootstrap"
import {useRouter} from "next/router"
import Link from "next/link"


const Menu = ({nav}) => {
	const router = useRouter()
	return (
		<Nav as={"nav"} className="centered">
			{nav.map((item) => (
				<NavItem key={item.id} item={item} pathname={router.pathname}/>
			))}
		</Nav>
	)
}

export default Menu

const NavItem = ({item, pathname}) => {

	const handleScroll = (e) => {
		e.preventDefault()
		let hash = e.target.getAttribute("href").replace("/", "")
		let el = hash ? document.querySelector(hash) : null
		el && el.scrollIntoView({
			behavior: "smooth"
		})

	}

	return (
		<Nav.Item>
			<Link href={`/${item.link}`} passHref={true}>
				{pathname === "/" && item.show_on_page !== 'self_page' ? (
					<Nav.Link onClick={handleScroll}>
						{item.name}
					</Nav.Link>

				) : (
					<Nav.Link disabled={item.active}>
						{item.name}
					</Nav.Link>
				)}
			</Link>
		</Nav.Item>
	)
}
