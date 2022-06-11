
import Container from "../UI/container"

import Slider from "../UI/slider"


export default function PageHeader({logo, header}) {
	return (
		<header className="post-header flex-column">
			<Container className="py-2vh">
				{header.map(obj => (
					obj.post_type === 'slider' && <Slider key={obj.id} {...obj.content}/>
				))
				}
			</Container>
		</header>
	)
}
