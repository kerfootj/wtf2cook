'use client';
import styled from '@emotion/styled';
import { Facebook, Google, Reddit } from '@mui/icons-material';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';

const StyledFacebookButton = styled(Button)`
    color: #ffffff;
    background: #3b5998;

    &:hover {
        background: #5d77b9;
    }

    &:active {
        background: #7f97dc;
    }

    width: 100%;
    text-transform: none;
`;

export const FacebookButton = () => (
    <StyledFacebookButton
        variant="contained"
        size="large"
        startIcon={<Facebook />}
        onClick={() => signIn('facebook')}
    >
        Continue with Facebook
    </StyledFacebookButton>
);

const StyledGoogleButton = styled(Button)`
    color: #ffffff;
    background: #4285f4;

    &:hover {
        background: #0069d3;
    }

    &:active {
        background: #004eb4;
    }

    width: 100%;
    text-transform: none;
`;

export const GoogleButton = () => (
    <StyledGoogleButton
        variant="contained"
        size="large"
        startIcon={<Google />}
        onClick={() => signIn('google')}
    >
        Continue with Google
    </StyledGoogleButton>
);

const StyledRedditButton = styled(Button)`
    color: #ffffff;
    background: #ff5700;

    &:hover {
        background: #ff6e00;
    }

    &:active {
        background: #ff8400;
    }

    width: 100%;
    text-transform: none;
`;

export const RedditButton = () => (
    <StyledRedditButton
        variant="contained"
        size="large"
        startIcon={<Reddit />}
        onClick={() => signIn('reddit')}
    >
        Continue with Reddit
    </StyledRedditButton>
);
