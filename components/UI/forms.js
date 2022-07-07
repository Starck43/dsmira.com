import {Fragment} from "react"

import {Form, Button} from "react-bootstrap"
import Control from "./controls"
import SubTitle from "./subtitle"

export const MessageTemplate = ({
	                             name,
	                             data,
	                             validated,
	                             submitHandler,
	                             closeHandler = null,
	                             confirmBtnCaption = "Отправить",
	                             cancelBtnCaption = "",
	                             compact = true,
	                             modal = true,
                             }) => {
	return (
		<Form id={name} className={`mx-auto my-3`} onSubmit={submitHandler} validated={validated}>
			{Object.keys(data).map((key) => (
				<Fragment key={key}>
					{typeof data[key] === "string" &&
					<SubTitle>{data[key]}</SubTitle>
					}
					{data[key] instanceof Object && !(data[key] instanceof Array) &&
					<Control {...data[key]} name={key} compact={compact}/>
					}
					{data[key] instanceof Array &&
					data[key].map((obj, index) => <Control {...obj} name={key + index} compact={compact} key={index}/>)
					}
				</Fragment>
			))}
			<div className="centered pt-3 gap">
				<Button variant="primary" type="submit">{confirmBtnCaption}</Button>
				{modal && cancelBtnCaption &&
				<Button variant="secondary" type="button" onClick={closeHandler}>{cancelBtnCaption}</Button>}
			</div>
		</Form>
	)
}

