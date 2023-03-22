import { useRef, useState } from "react"

import { Button } from "react-bootstrap"
import FormResponse from "./form-response"
import ModalDialog from "/components/UI/dialogs"
import { MessageTemplate } from "/components/UI/forms"
import { FEEDBACK_FORM } from "/core/constants"
import { postForm } from "/core/api"

//import style from "~/styles/reg.module.sass"

const FeedbackModal = ({ isShow, closeHandler, formName = "feedback-form" }) => {
    const [response, setResponse] = useState(null)
    const [validated, setValidated] = useState(false)
    const formRef = useRef(null)

    const uploadData = async (form) => {
        let res = await postForm(form)
        setResponse(res)
        return res
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        e.stopPropagation()
        let form = formRef?.current || e.target.parentNode.parentNode.querySelector(formName)

        if (form.checkValidity() === false) {
            setValidated(true)
            let invalid = form.querySelector(":invalid")
            if (invalid) {
                invalid.scrollIntoView({ behavior: "smooth" })
                invalid.focus()
            }
        } else {
            setResponse(uploadData(form))
        }
    }

    const handleClose = () => closeHandler(false)

    if (response instanceof Promise)
        return (
            <ModalDialog title="Отправка сообщения" show={isShow} closeHandler={closeHandler}>
                <h4 className="title">Связь с сервером...</h4>
            </ModalDialog>
        )
    else if (response && response?.data.status !== -1 && !response?.error)
        return (
            <ModalDialog
                title={`Сообщение ${
                    response.data?.status === 0 ? "успешно отправлено" : "уже зарегистрировано ранее"
                }!`}
                show={isShow}
                closeHandler={closeHandler}
                className="registration"
            >
                <FormResponse data={response?.data} />
            </ModalDialog>
        )
    else if (typeof response === "undefined")
        return (
            <ModalDialog
                title={`Сообщение отправлено с ошибкой!`}
                show={isShow}
                closeHandler={closeHandler}
                footer={
                    <>
                        <Button variant="secondary" type="button" onClick={handleClose}>
                            Закрыть
                        </Button>
                        <span className="message status-error">
                            Ошибка на сервере
                            <br />
                            Internal server error 500
                        </span>
                    </>
                }
                className="registration"
            >
                <h4>Регистрация прошла с ошибками на сервере</h4>
                <p>Рекомендуем сообщить об этом администратору сайта</p>
            </ModalDialog>
        )
    else if (response?.data && (response?.data.status === -1 || response?.error))
        return (
            <ModalDialog
                title="Ошибка отправки сообщения"
                show={isShow}
                closeHandler={closeHandler}
                footer={
                    <span className="status-message error centered">
                        {response?.response
                            ? `Код ошибки: ${response?.response?.status}`
                            : `Ошибка структуры данных. Обратитесь к администратору сайта!`}
                    </span>
                }
                className="registration-error"
            >
                <h4 className="title">Возникла ошибка на сервере!</h4>
                <p>{response?.response?.text}</p>
            </ModalDialog>
        )
    else
        return (
            <ModalDialog title="Новое сообщение" show={isShow} closeHandler={handleClose} className="new-message">
                <MessageTemplate
                    formRef={formRef}
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
