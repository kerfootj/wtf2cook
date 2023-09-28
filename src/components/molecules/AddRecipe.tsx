'use client';

import { Edit } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function AddRecipe() {
    const { data } = useSession();

    if (!data) {
        return null;
    }

    return (
        <Paper sx={{ px: 2, py: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ userSelect: 'none' }}>
                    What the f*ck are these recipes? Submit your own.
                </Typography>

                <Link
                    href="/recipes/new"
                    passHref
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <Button variant="outlined" endIcon={<Edit />}>
                        Add a F*cking Recipe
                    </Button>
                </Link>
            </Box>
        </Paper>
    );
}
