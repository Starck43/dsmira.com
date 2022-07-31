import ModalDialog from "../UI/dialogs"


const FormResponse = ({response, handleClose, className = "alert-container"}) => {
	if (response instanceof Promise || response === null) return (
		<ModalDialog
			className={`${className}`}
			closeHandler={handleClose}
		>
			<h3 className="subtitle">Отправка сообщения...</h3>
		</ModalDialog>
	)
	else if (!response?.error && response?.data) return (
		<ModalDialog
			className={`${className} success`}
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

export default FormResponse
