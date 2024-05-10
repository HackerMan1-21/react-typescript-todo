import { ToDoType } from "../types";

// type ToDoType = {
// 	id: number,
// 	title: string,
// 	done: boolean,
// 	limit: Date,
// }
type ToDoPropsType = {
	todo: ToDoType,
	setToDosTitle: (id: number, title: string) => void
}

export const ToDo = ({
	// id, title, done, limit
	todo,
	setToDosTitle
}: ToDoPropsType) => {
	const { id, title, done, limit } = todo
	return (
		<>
			<h2>{id}</h2>
			<h2>{title}</h2>
			<h2>{done ? "完了" : "未完了"}</h2>
			<p>{limit > new Date() ? "まだいける" : "期限切れ"}</p>

			<input type="text" onChange={e => setToDosTitle(id, e.target.value)} />
		</>
	)
};
