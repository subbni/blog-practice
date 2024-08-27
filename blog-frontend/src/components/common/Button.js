import palette from '../../lib/styles/palette';
import styled from 'styled-components';

const StyledButton = styled.button`
	border: none;
	border-radius: 4px;
	font-size: 1rem;
	font-weight: bold;
	padding: 0.25rem 1rem;
	color: white;
	outline: none;
	cursor: pointer;

	background: ${palette.gray[8]};
	&:hover {
		background: ${palette.gray[6]};
	}
`;

// styled-components로 만든 컴포넌트를 바로 내보내면 자동 import가 제대로 작동하지 않음
const Button = (props) => <StyledButton {...props} />;

export default Button;
