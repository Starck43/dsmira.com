import {Button, Modal} from "react-bootstrap"
import React from "react"


export const ModalDialog = ({
	                            children,
	                            show = false,
	                            closeHandler,
	                            title,
	                            footer,
	                            className,
	                            size = "sm",
	                            scrollable = true
                            }) => (
	<Modal className={className}
	       contentClassName="alert-content"
	       centered
	       size={size}
	       fullscreen="sm-down"
	       scrollable={scrollable}
	       backdrop={false}
	       show={show}
	       onHide={closeHandler}
	>
		<Modal.Header closeButton>
			{title && <Modal.Title>{title}</Modal.Title>}
		</Modal.Header>

		{children &&
		<Modal.Body className="flex-column center">
			{children}
		</Modal.Body>
		}

		<Modal.Footer>
			{footer || <Button variant="secondary" type="button" onClick={closeHandler}>Закрыть</Button>}
		</Modal.Footer>
	</Modal>
)



