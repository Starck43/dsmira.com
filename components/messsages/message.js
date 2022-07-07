import React, {Fragment, useEffect, useState} from "react"

import {MessageTemplate} from "../UI/forms"
import {postForm} from "../../core/api"
import ModalResponse from "./modal-response"

//import style from "~/styles/reg.module.sass"


const MessageForm = ({formName, formData}) => {
	const [response, setResponse] = useState(null)
	const [validated, setValidated] = useState(false)

	useEffect(() => {
		if (!validated && !response?.error) {
			setResponse(null)
			let form = document.getElementById(formName)
			form && form.reset()
		}
	}, [validated])

	const handleClose = (e) => {
		setValidated(false)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		let form = e.target

		if (form?.checkValidity() === false) {
			setValidated(true)
			let invalid = form.querySelector(":invalid")
			if (invalid) {
				invalid.scrollIntoView({behavior: "smooth"})
				invalid.focus()
			}
		} else {
			setValidated(true)
			let res = await postForm(form)
			setResponse(res)
		}
	}

	return (
		<Fragment>
			<MessageTemplate
				name={formName}
				data={formData}
				compact={false}
				validated={validated}
				submitHandler={handleSubmit}
				modal={false}
			/>
			{validated && <ModalResponse response={response} handleClose={handleClose}/>}

		</Fragment>

	)
}

export default MessageForm


