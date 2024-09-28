'use client';
import {
    TextareaAutosize,
    TextareaAutosizeProps,
    Typography,
    TypographyProps,
    TypographyVariant,
    css,
    styled,
    useTheme,
} from '@mui/material';
import { useRecipe } from '../context/RecipeContext';

type EditorTextAreaProps = {
    value?: string | number | null;
    onChange: (value: string) => void;
    typography: TypographyProps & { variant: TypographyVariant };
    editor?: TextareaAutosizeProps;
};

const StyleTextArea = styled(TextareaAutosize)(
    ({ theme }) =>
        css`
            color: white;
            background: transparent;
            border: 1px solid ${theme.palette.grey[700]};
            border-radius: 8px;

            width: 100%;
            border: 1px solid ${theme.palette.grey[800]};

            &:focus {
                border: 1px solid ${theme.palette.grey[700]};
            }
        `,
);

export function EditorTextArea(props: EditorTextAreaProps) {
    const { value, typography, editor, onChange } = props;
    const { editing } = useRecipe();
    const theme = useTheme();

    return editing ? (
        <StyleTextArea
            {...editor}
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            style={theme.typography[typography.variant]}
        />
    ) : (
        <Typography {...typography}>{value}</Typography>
    );
}
