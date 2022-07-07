import DateFormatter from "../UI/date-formatter"
import {BlockAnimation} from "../UI/animation"


export default function PostMeta({title, excerpt, created_date, className}) {
	return (
		<BlockAnimation className={`meta ${className} mt-4`} effect="slideLeft" options={{key:0}}>
			{title && <h4 className="meta-title my-2">{title}</h4>}
			{excerpt && <p className="meta-excerpt">{excerpt}</p>}

			<div className="meta-created-date mt-2">
				{created_date
					? <DateFormatter datetime={new Date(created_date)}/>
					: <span>в стадии реализации</span>
				}
			</div>
		</BlockAnimation>
	)
}