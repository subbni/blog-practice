import React from 'react';
import styled from 'styled-components';
import Responsive from './Responsive';
import Button from './Button';
import { Link } from '../../../node_modules/react-router-dom/dist/index';

const HeaderBlock = styled.div`
	position: fixed;
	width: 100%;
	background: white;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

/**
 * Responsive 컴포넌트 속성에 스타일을 추가해서 새로운 컴포넌트 생성
 */
const Wrapper = styled(Responsive)`
	height: 4rem;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.logo {
		font-size: 1.125rem;
		font-weight: 800;
		letter-spacing: 2px;
	}
	.right {
		display: flex;
		align-items: center;
	}
`;

const Spacer = styled.div`
	height: 4rem;
`;

const UserInfo = styled.div`
	font-weight: 800;
	margin-right: 1rem;
`;

const Header = ({ user }) => {
	return (
		<>
			<HeaderBlock>
				<Wrapper>
					<Link to="/" className="logo">
						REACTERS
					</Link>
					{user ? (
						<div className="right">
							<UserInfo>{user.username}</UserInfo>
							<Button to="/logout">로그아웃</Button>
						</div>
					) : (
						<div className="right">
							<Button to="/login">로그인</Button>
						</div>
					)}
				</Wrapper>
			</HeaderBlock>
			<Spacer />
		</>
	);
};

export default Header;
