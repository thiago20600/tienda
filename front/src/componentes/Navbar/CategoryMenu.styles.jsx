import styled from 'styled-components';

export const CategoryMenuContainer = styled.div`
    position: relative;
    z-index: 10;
`;

export const CategoryMenuButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.55rem 0.7rem;
    border: 0;
    border-radius: 0;
    background: ${(props) => props.$activo ? '#e0f2fe' : 'transparent'};
    color: #1e293b;
    font: inherit;
    cursor: pointer;
    transition: background 160ms ease, color 160ms ease;
    &:hover { background: #e0f2fe; color: #0369a1; }
    span { font-size: 1rem; line-height: 0.7; }
`;

export const CategoryMenuPanel = styled.div`
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    width: min(680px, calc(100vw - 2rem));
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0;
    background: #fff;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16);
    transform: none;
    &::before {
        content: '';
        position: absolute;
        top: -7px;
        left: 1.5rem;
        width: 12px;
        height: 12px;
        border-top: 1px solid #e2e8f0;
        border-left: 1px solid #e2e8f0;
        background: #fff;
        transform: rotate(45deg);
    }
    p { margin: 0.5rem; color: #64748b; }
    @media (max-width: 650px) {
        position: fixed;
        top: 4.8rem;
        left: 1rem;
        width: calc(100vw - 2rem);
        transform: none;
    }
`;

export const CategoryMenuAll = styled.div`
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
`;

export const CategoryMenuGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: minmax(2.3rem, auto);
    max-height: calc(5 * 2.3rem);
    overflow-y: auto;
    gap: 0.5rem 0.75rem;
    @media (max-width: 560px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const CategoryLink = styled.button`
    width: 100%;
    padding: 0.6rem;
    border: 0;
    border-radius: 0;
    background: ${(props) => props.$destacada ? '#f8fafc' : 'transparent'};
    color: ${(props) => props.$destacada ? '#0369a1' : '#334155'};
    font: inherit;
    font-size: 0.9rem;
    font-weight: ${(props) => props.$destacada ? 700 : 500};
    text-align: left;
    cursor: pointer;
    &:hover { background: #e0f2fe; color: #0369a1; }
`;
