import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, login } from '../modules/auth';
import AuthForm from '../components/auth/AuthForm';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import { check } from '../modules/user';

const LoginForm = () => {
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
		form: auth.login,
		auth: auth.auth,
		authError: auth.authError,
		user: user.user,
	}));

	// 인풋 변경 핸들러
	const onChange = (e) => {
		const { value, name } = e.target;
		dispatch(
			changeField({
				form: 'login',
				key: name,
				value,
			}),
		);
	};

	// form 등록 핸들러
	const onSubmit = (e) => {
		e.preventDefault();
		const { username, password } = form;
		dispatch(login({ username, password }));
	};

	useEffect(() => {
		dispatch(initializeForm('login'));
	}, [dispatch]);

	useEffect(() => {
		if (authError) {
			console.log('오류 발생');
			console.log(authError);
			setError('로그인 실패');
			return;
		}
		if (auth) {
			console.log('로그인 성공');
			dispatch(check());
		}
	}, [authError, auth, dispatch]);

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [navigate, user]);

	return (
		<AuthForm
			type="login"
			form={form}
			onChange={onChange}
			onSubmit={onSubmit}
			error={error}
		/>
	);
};

export default LoginForm;
