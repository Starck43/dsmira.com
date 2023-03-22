import { Fragment } from "react"

import { Form, Button } from "react-bootstrap"
import Control from "./controls"
import SubTitle from "./subtitle"
import { WHATSAPP, WHATSAPP_URL } from "/core/constants"

//import styles from "~/styles/modules/forms.module.sass"

export const MessageTemplate = ({
    formRef,
    name,
    data,
    whatsapp,
    telegram,
    validated,
    compact = true,
    confirmBtnCaption = "Отправить",
    cancelBtnCaption = "Отмена",
    submitHandler,
    closeHandler = null,
}) => {
    const createWhatsappLink = (e) => {
        let text = e.target.form.querySelector("textarea").value
        let href = e.target.dataset.href + "&text=" + encodeURIComponent(text)
        window.open(href, "_ blank")
    }

    return (
        <Form ref={formRef} id={name} className={`mx-auto my-3`} onSubmit={submitHandler} validated={validated}>
            {Object.keys(data).map((key) => (
                <Fragment key={key}>
                    {typeof data[key] === "string" && <SubTitle>{data[key]}</SubTitle>}
                    {data[key] instanceof Object && !(data[key] instanceof Array) && (
                        <Control {...data[key]} name={key} compact={compact} />
                    )}
                    {data[key] instanceof Array &&
                        data[key].map((obj, index) => (
                            <Control {...obj} name={key + index} compact={compact} key={index} />
                        ))}
                </Fragment>
            ))}
            <div className="buttons-group centered pt-3 gap-3">
                <Button variant="primary" type="submit">
                    {confirmBtnCaption}
                </Button>
                {whatsapp && (
                    <Button
                        variant="secondary"
                        type="button"
                        data-href={`${WHATSAPP_URL}&phone=${whatsapp.slice(-11)}`}
                        onClick={createWhatsappLink}
                    >
                        Whatsapp
                    </Button>
                )}
                {closeHandler && (
                    <Button variant="secondary" type="button" onClick={closeHandler}>
                        {cancelBtnCaption}
                    </Button>
                )}
            </div>
        </Form>
    )
}
