import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from '../node_modules/react-router-dom/dist/index';
import { applyMiddleware, createStore } from '../node_modules/redux/dist/redux';
import rootReducer, { rootSaga } from './modules/index';
import { composeWithDevTools } from '../node_modules/redux-devtools-extension/index';
import { Provider } from '../node_modules/react-redux/dist/react-redux';
import createSagaMiddleware from 'redux-saga';
import { check, tempSetUser } from './modules/user';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadUser() {
	try {
		const user = localStorage.getItem('user');
		if (!user) return;

		store.dispatch(tempSetUser(JSON.parse(user)));
		store.dispatch(check());
	} catch (e) {
		console.log('localStorage is not working');
	}
}

sagaMiddleware.run(rootSaga);
loadUser();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
