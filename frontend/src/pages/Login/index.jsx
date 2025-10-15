import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import { StyledLogin } from "./styles"

export default function Login() {
	return (
		<StyledLogin>
			<Header />
			<h1>Login</h1>
			<Footer />
		</StyledLogin>
	)
}
