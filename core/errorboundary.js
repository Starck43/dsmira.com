import React from 'react'
import Error from "./errors/error"

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error) {
		return {
			errorTrace: error,
			hasError: true
		}
	}

	render() {
		if (this.state.hasError) return <Error />
		return this.props.children
	}
}

export default ErrorBoundary
