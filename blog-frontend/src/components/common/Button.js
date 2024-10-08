import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import styled, { css } from 'styled-components';

const buttonStyle = css`
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

	${(fullWidth) =>
		fullWidth &&
		css`
			padding-top: 0.75rem;
			padding-bottom: 0.75rem;
			width: 100%;
			font-size: 1.125rem;
		`}

	${(cyan) =>
		cyan &&
		css`
			background: ${palette.cyan[5]};
			&:hover {
				background: ${palette.cyan[4]};
			}
		`}
`;

const StyledButton = styled.button`
	${buttonStyle}
`;

const StyledLink = styled(Link)`
	${buttonStyle}
`;

// styled-components로 만든 컴포넌트를 바로 내보내면 자동 import가 제대로 작동하지 않음
const Button = (props) => {
	return props.to ? (
		<StyledLink {...props} cyan={props.cyan ? 1 : 0} />
	) : (
		<StyledButton {...props} />
	);
};

export default Button;
