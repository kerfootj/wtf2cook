import { css, styled } from '@mui/material';

export const DropZoneContainer = styled('div')(
    ({ theme }) =>
        css`
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px dashed white;
            border-radius: 4px;
            padding: 16px;
            width: 100%;
            height: 100%;
            cursor: pointer;
            transition: border-color 0.2s ease-in-out;

            &:hover {
                border-color: ${theme.palette.primary.main};
            }

            &:focus {
                border-color: ${theme.palette.primary.main};
            }

            &:active {
                border-color: ${theme.palette.primary.main};
            }
        `,
);

export const DropZoneContent = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    transition: color 0.2s ease-in-out;
    gap: 2px;
`;
