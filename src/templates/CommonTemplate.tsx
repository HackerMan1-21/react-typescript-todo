import { ReactNode } from "react"
import { Header } from "../layouts/Header"

export const CommonTemplat = ({ children }: {
	children: ReactNode
}) => {
	return (
		<>
			<Header />
			<main>
				{children}
			</main>
		</>
	)
};
