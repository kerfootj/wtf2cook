'use client';
import {
    Input,
    InputProps,
    Typography,
    TypographyProps,
    TypographyVariant,
    css,
    styled,
} from '@mui/material';
import { useRecipe } from '../context/RecipeContext';

type EditorInputProps = {
    value?: string | number | null;
    onChange: (value: string) => void;
    typography: TypographyProps & { variant: TypographyVariant };
    editor?: InputProps;
};

const StyledInput = styled(Input)(
    ({ theme }) =>
        css`
            color: white;
            background: transparent;
            border: 1px solid ${theme.palette.grey[700]};
            border-radius: 4px;
            padding-left: 8px;

            width: 100%;
        `,
);

export function EditorInput(props: EditorInputProps) {
    const { value, typography, editor, onChange } = props;
    const { editing } = useRecipe();

    return editing ? (
        <StyledInput
            {...editor}
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
        />
    ) : (
        <Typography {...typography}>{value}</Typography>
    );
}
