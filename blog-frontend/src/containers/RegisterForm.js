import React, { useEffect, useState } from 'react';
import AuthForm from '../components/auth/AuthForm';
import { changeField, initializeForm, register } from '../modules/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import { check } from '../modules/user';

const RegisterForm = () => {
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
		form: auth.register,
		auth: auth.auth,
		authError: auth.authError,
		user: user.user,
	}));
	const navigate = useNavigate();

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
		const { username, password, passwordConfirm } = form;
		// 빈 칸 존재
		if ([username, password, passwordConfirm].includes('')) {
			setError('빈 칸을 모두 입력하세요.');
			return;
		}
		// 비밀번호 불일치
		if (password !== passwordConfirm) {
			setError('비밀번호가 일치하지 않습니다.');
			dispatch(changeField({ form: 'register', key: 'password', value: '' }));
			dispatch(
				changeField({ form: 'register', key: 'passwordConfirm', value: '' }),
			);
			return;
		}
		dispatch(register({ username, password }));
	};

	// 첫 렌더링시 form 초기화
	useEffect(() => {
		dispatch(initializeForm('register'));
	}, [dispatch]);

	// 회원가입 성공/실패 처리
	useEffect(() => {
		if (authError) {
			// 계정명 중복
			if (authError.response.status === 409) {
				setError('이미 존재하는 계정명입니다.');
				return;
			}
			// 기타
			setError('회원가입 실패');
			return;
		}
		if (auth) {
			console.log('회원가입 성공');
			console.log(auth);
			dispatch(check());
		}
	}, [auth, authError, dispatch]);

	// user값 설정 확인
	useEffect(() => {
		if (user) {
			navigate('/'); // 홈화면으로 이동
			console.log(user);
		}
	}, [navigate, user]);

	return (
		<AuthForm
			type="register"
			form={form}
			onChange={onChange}
			onSubmit={onSubmit}
			error={error}
		/>
	);
};

export default RegisterForm;
