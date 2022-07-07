import {ModalDialog} from "../UI/dialogs"
import {Button, Modal} from "react-bootstrap"
import React from "react"


const ModalResponse = ({response, className = "alert-container", handleClose}) => {
	if (response instanceof Promise || response === null) return (
		<ModalDialog
			className={`${className}`}
			show
			closeHandler={handleClose}
		>
			<h3 className="subtitle">Отправка сообщения...</h3>
		</ModalDialog>
	)
	else if (!response?.error && response?.data) return (
		<ModalDialog
			className={`${className} success`}
			show
			closeHandler={handleClose}
		>
			<h3 className="subtitle">Сообщение успешно доставлено!</h3>
			<div className="answer status-success flex-column">
				<div>{response?.data?.answer}</div>
				<span className="mt-3">{`С уважением, ${response?.data?.owner}`}</span>
			</div>
		</ModalDialog>
	)
	else return (
			<ModalDialog
				className={`${className} error`}
				show
				closeHandler={handleClose}
			>
				<h3 className="subtitle">Возникла ошибка на сервере!</h3>
				<div className="answer status-error flex-column">
					<div>{response?.data?.answer}</div>
					<span className="mt-3">{response && `Код ошибки: ${response.response?.status}`}</span>
				</div>
			</ModalDialog>
		)
}

export default ModalResponse
