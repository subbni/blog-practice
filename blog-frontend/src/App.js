import { Route, Routes } from '../node_modules/react-router-dom/dist/index';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import WritePage from './pages/WritePage';
import React from 'react';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<PostListPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/write" element={<WritePage />} />
				<Route path="/:username">
					<Route index element={<PostListPage />} />
					<Route path=":postId" element={<PostPage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
