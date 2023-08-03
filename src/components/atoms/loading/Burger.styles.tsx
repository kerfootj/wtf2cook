import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const getSeedAnimation = (offset: number, rotation: number) => keyframes`
    ${offset * 5 + '%'} {
        visibility: hidden;
        transform: translateY(-20em) rotate(${rotation}deg);
    }

    ${offset * 5 + 10 + '%'}, 75% {
        visibility: visible;
        transform: translateY(0em) rotate(${rotation}deg);
    }

    100% {
        visibility: hidden;
    }
`;

const getAnimation = (offset: number) => keyframes`
    ${offset * 5 + '%'} {
        visibility: hidden;
        transform: translateY(-20em);
    }

    ${offset * 5 + 10 + '%'}, 75% {
        visibility: visible;
        transform: translateY(0em);
    }

    90%, 100% {
        transform: translateY(20em);
    }

    100% {
        visibility: hidden;
    }
`;

export const TakeOutBox = styled.div<{ size: number }>`
    margin: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    /* Size of all the burger parts are relative to this value (em) */
    font-size: ${(props) => props.size}px;

    overflow: hidden;
`;

export const SesameSeed = styled.div<{
    top: number;
    left: number;
    rotation: number;
}>`
    position: absolute;

    background: #f8ebca;

    width: 1em;
    height: 1em;

    border-radius: 0 50% 50% 50%;

    top: ${(props) => props.top}em;
    left: ${(props) => props.left}em;
    transform: rotate(${(props) => props.rotation}deg);

    animation: ${(props) =>
            getSeedAnimation(
                Math.floor(Math.random() * (85 - 60) + 60) / 10,
                props.rotation,
            )}
        4s ease-in-out 250ms infinite normal;
`;

export const BunTop = styled.div`
    position: relative;

    background: #fec36b;
    border-left: 2em solid #f9a33c;

    z-index: 1;

    width: 20em;
    height: 6em;

    border-top-left-radius: 10em;
    border-top-right-radius: 10em;

    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;

    z-index: 2;
    visibility: hidden;

    animation: ${getAnimation(5)} 4s ease-in-out 250ms infinite normal;
`;

/* eslint-disable */
export const Lettuce = styled.div`
    background: linear-gradient(to top right, #87c348 25%, #338c27);
    border-left: 2.5em solid #7bb03b;

    width: 21em;
    height: 6.4em;

    margin: -2.6em;

    border-radius: 100em;
    
    z-index: 1;
    visibility: hidden;

    animation: ${getAnimation(4)} 4s ease-in-out 250ms infinite normal;

    mask:
        radial-gradient(4.47em at 50% 6em, #87c348 99%, transparent 101%)
            calc(50% - 4em) 0/8em 51% repeat-x,
        radial-gradient(4.47em at 50% -4em, transparent 99%, #87c348 101%) 50%
            2em/8em calc(51% - 2em) repeat-x,
        radial-gradient(4.47em at 50% calc(100% - 6em), #87c348 99%, transparent 101%)
            50% 100%/8em 51% repeat-x,
        radial-gradient(4.47em at 50% calc(100% + 4em), transparent 99%, #87c348 101%)
            calc(50% - 4em) calc(100% - 2em) / 8em calc(51% - 2em) repeat-x;
`;
/* eslint-enable */

export const Tomato = styled.div`
    background: linear-gradient(to right, #da584a, #b73829);
    border-left: 2.6em solid #c84a3d;

    width: 21em;
    height: 2.4em;

    border-radius: 0.4em;

    visibility: hidden;

    animation: ${getAnimation(3)} 4s ease-in-out 250ms infinite normal;
`;

export const Cheese = styled.div`
    background: #ffcc2b;
    border-left: 3.1em solid #e6b91e;

    width: 22em;
    height: 1em;

    border-radius: 0.5em;

    z-index: 1;
    visibility: hidden;

    animation: ${getAnimation(2)} 4s ease-in-out 250ms infinite normal;

    &:before {
        content: '';
        position: absolute;

        background: #ffcc2b;

        width: 1.6em;
        height: 1.6em;

        border-radius: 0 50% 50% 50%;

        transform: translate(1em, 0.4em) rotate(45deg);
    }

    &:after {
        content: '';
        position: absolute;

        background: #ffcc2b;

        width: 1.1em;
        height: 1.1em;

        border-radius: 0 50% 50% 50%;

        transform: translate(4.4em, 0.5em) rotate(45deg);
    }
`;

export const Patty = styled.div`
    /* background: #3d271c; */
    background: linear-gradient(to bottom, #3d271c, #452c20);
    border-left: 4.1em solid #2f1f17;

    width: 24em;
    height: 3.8em;

    border-radius: 1.9em;

    visibility: hidden;

    animation: ${getAnimation(1)} 4s ease-in-out 250ms infinite normal;
`;

export const BunBottom = styled.div`
    background: #fec36b;
    border-left: 2.2em solid #f9a33c;
    border-bottom: 0.2em solid #ffe9cf;

    width: 20em;
    height: 4em;

    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;

    border-bottom-left-radius: 2.5em;
    border-bottom-right-radius: 2.5em;

    visibility: hidden;

    animation: ${getAnimation(0)} 4s ease-in-out 250ms infinite normal;
`;
