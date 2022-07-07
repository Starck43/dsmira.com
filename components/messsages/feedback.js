import React, {useState} from "react"

import {FormTemplate} from "../UI/forms"
import {SuccessResponse} from "./modal-response"
import {FEEDBACK_FORM} from "../../core/constants"
import {Fetch} from "../../core/Fetch"
import {AlertDialog, ModalDialog} from "../UI/dialogs"
import {Button, Modal} from "react-bootstrap"

//import style from "~/styles/reg.module.sass"


const FeedbackModal = ({isShow, closeHandler, formName = "feedback-form"}) => {
	const [respondedData, setRespondedData] = useState(null)
	const [validated, setValidated] = useState(false)


	const uploadData = async (form) => {
		let data = new FormData(form) // конвертируем данные формы в json
		//console.log(data)
		const res = await Fetch(process.env.API_SERVER, process.env.API_ENDPOINTS.feedback, {}, {
			method: "post",
			headers: {
				"Origin": process.env.SERVER,
				//'Content-Type': 'application/x-www-form-urlencoded',
				//'Content-Type': 'multipart/form-data',
				"Content-Type": "application/json",
				"Accept": "application/json, application/xml, text/plain, text/html",
			},
			body: JSON.stringify(data),
			//credentials: 'include',
		})

		setRespondedData(res)
		console.log("feedback data:", res)

		return res
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		e.stopPropagation()
		let form = e.target.parentNode.parentNode.querySelector(formName)

		if (form.checkValidity() === false) {
			setValidated(true)
			let invalid = form.querySelector(":invalid")
			if (invalid) {
				invalid.scrollIntoView({behavior: "smooth"})
				invalid.focus()
			}
		} else {
			setRespondedData(uploadData(form))
		}
	}

	const handleClose = () => closeHandler(false)


	if (respondedData instanceof Promise) return (
		<AlertDialog title="Отправка сообщения" show={isShow} closeHandler={closeHandler}>
			<h4 className="title">Связь с сервером...</h4>
		</AlertDialog>
	)

	else if (respondedData && respondedData?.data.status !== -1 && !respondedData?.error) return (
		<AlertDialog
			title={`Сообщение ${respondedData.data?.status === 0 ? "успешно отправлено" : "уже зарегистрировано ранее"}!`}
			show={isShow}
			closeHandler={closeHandler}
			footer={
				<Modal.Footer className="centered">
					<Button variant="secondary" type="button" onClick={handleClose}>Закрыть</Button>
				</Modal.Footer>
			}
			className="registration"
		>
			<SuccessResponse data={respondedData?.data}/>
		</AlertDialog>
	)

	else if (typeof respondedData === "undefined") return (
		<AlertDialog
			title={`Сообщение отправлено с ошибкой!`}
			show={isShow}
			closeHandler={closeHandler}
			footer={
				<Modal.Footer className="centered">
					<Button variant="secondary" type="button" onClick={handleClose}>Закрыть</Button>
					<span className="message status-error">Ошибка на сервере<br/>Internal server error 500</span>
				</Modal.Footer>
			}
			className="registration"
		>
			<h4>Регистрация прошла с ошибками на сервере</h4>
			<p>Рекомендуем сообщить об этом администратору сайта</p>
		</AlertDialog>
	)

	else if (respondedData?.data && (respondedData?.data.status === -1 || respondedData?.error)) return (
		<AlertDialog
			title="Ошибка отправки сообщения"
			show={isShow}
			closeHandler={closeHandler}
			footer={
				<Modal.Footer>
					<span className="status-message error centered">
						{respondedData?.response ? `Код ошибки: ${respondedData?.response?.status}` : "Ошибка структуры данных. Обратитесь к администратору сайта!"}
					</span>
				</Modal.Footer>
			}
			className="registration-error"
		>
			<h4 className="title">Возникла ошибка на сервере!</h4>
			<p>{respondedData?.response?.text}</p>
		</AlertDialog>
	)

	else return (
			<ModalDialog
				title="Новое сообщение"
				show={isShow}
				closeHandler={handleClose}
				className="new-message"
			>
				<FormTemplate
					name={formName}
					data={FEEDBACK_FORM}
					validated={validated}
					submitHandler={handleSubmit}
					closeHandler={handleClose}
				/>
			</ModalDialog>
		)
}

export default FeedbackModal


