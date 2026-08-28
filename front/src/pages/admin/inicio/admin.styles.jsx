import styled from 'styled-components';

export const DashboardContainer = styled.main`
	padding: 2rem;
	color: #1e293b;

	h1 { margin: 0 0 0.5rem; font-size: 1.7rem; }
	p { margin: 0; color: #64748b; }

	@media (max-width: 600px) { padding: 1rem; }
`;

export const DashboardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
	margin-top: 1.5rem;

	@media (max-width: 700px) { grid-template-columns: 1fr; }
`;

export const DashboardCard = styled.section`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1.25rem;
	background: #fff;
	border: 1px solid #e2e8f0;
	border-radius: 8px;

	span { color: #64748b; font-size: 0.9rem; }
	strong { font-size: 2rem; color: #1e293b; }
`;

export const DashboardLink = styled.a`
	width: fit-content;
	color: #0369a1;
	font-weight: 600;
	text-decoration: none;
	&:hover { text-decoration: underline; }
`;

export const DashboardMessage = styled.p`
	margin-top: 1rem;
`;
