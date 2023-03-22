import { Fragment, useEffect, useRef, useState } from "react"

import { postForm } from "/core/api"
import { MessageTemplate } from "/components/UI/forms"
import FormResponse from "./form-response"

//import style from "~/styles/reg.module.sass"

const MessageForm = (props) => {
    const [response, setResponse] = useState(null)
    const [validated, setValidated] = useState(false)
    const formRef = useRef(null)

    useEffect(() => {
        // cleaning form fields
        if (!validated && !response?.error) {
            setResponse(null)
            //let form = document.getElementById(formName)
            formRef?.current.reset()
        }
    }, [validated, response])

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        let form = formRef?.current || e.target

        if (form?.checkValidity() === false) {
            setValidated(true)
            let invalid = form.querySelector(":invalid")
            if (invalid) {
                invalid.scrollIntoView({ behavior: "smooth" })
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
                formRef={formRef}
                {...props}
                modal={false}
                compact={false}
                validated={validated}
                submitHandler={handleSubmit}
            />
            {validated && <FormResponse response={response} handleClose={() => setValidated(false)} />}
        </Fragment>
    )
}

export default MessageForm
