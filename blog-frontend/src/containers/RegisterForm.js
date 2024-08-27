import React, { useEffect } from 'react';
import AuthForm from '../components/auth/AuthForm';
import { changeField, initializeForm } from '../modules/auth';
import { useDispatch, useSelector } from 'react-redux';

const RegisterForm = () => {
	const dispatch = useDispatch();
	const { form } = useSelector(({ auth }) => ({
		form: auth.register,
	}));

	// 인풋 변경 핸들러
	const onChange = (e) => {
		const { value, name } = e.target;
		dispatch(
			changeField({
				form: 'register',
				key: name,
				value,
			}),
		);
	};

	// form 등록 핸들러
	const onSubmit = (e) => {
		e.preventDefault();
		// 추후 구현
	};

	useEffect(() => {
		dispatch(initializeForm('register'));
	}, [dispatch]);

	return (
		<AuthForm
			type="register"
			form={form}
			onChange={onChange}
			onSubmit={onSubmit}
		/>
	);
};

export default RegisterForm;
