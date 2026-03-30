declare module './pages/Home/Home' {
	import { FunctionComponent } from 'react';
	const Home: FunctionComponent<any>;
	export { Home };
	export default Home;
}

declare module './pages/Detail/Detail' {
	import { FunctionComponent } from 'react';
	const Detail: FunctionComponent<any>;
	export { Detail };
	export default Detail;
}

declare module './pages/Edit/Edit' {
	import { FunctionComponent } from 'react';
	const Edit: FunctionComponent<any>;
	export { Edit };
	export default Edit;
}

declare module './types/item' {
	export type Item = any;
}
