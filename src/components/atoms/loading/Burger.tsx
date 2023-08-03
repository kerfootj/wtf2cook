'use client';
import {
    BunBottom,
    BunTop,
    Cheese,
    Lettuce,
    Patty,
    SesameSeed,
    TakeOutBox,
    Tomato,
} from './Burger.styles';

export type BurgerProps = {
    size?: number;
};

function BunTopWithSesameSeeds() {
    const seeds = [
        { top: 0.2, left: 3.5, rotation: 30 },
        { top: 0.5, left: 6.5, rotation: 148 },
        { top: 0.8, left: 9.5, rotation: 210 },
        { top: 0.4, left: 12.5, rotation: 92 },
        { top: 1.2, left: 1.5, rotation: 276 },
        { top: 1.5, left: 4.9, rotation: 316 },
        { top: 1.8, left: 7.8, rotation: 143 },
        { top: 1.5, left: 11.2, rotation: 269 },
        { top: 1.7, left: 14.0, rotation: 318 },
        { top: 2.4, left: 0.0, rotation: 126 },
        { top: 2.6, left: 2.6, rotation: 56 },
        { top: 3.3, left: 5.6, rotation: 251 },
        { top: 3.2, left: 9.5, rotation: 76 },
        { top: 2.5, left: 12.5, rotation: 203 },
        { top: 3.1, left: 15.4, rotation: 178 },
        { top: 4.2, left: -1.1, rotation: 292 },
        { top: 3.9, left: 1.2, rotation: 2 },
        { top: 4.5, left: 3.5, rotation: 107 },
        { top: 4.2, left: 7.8, rotation: 210 },
        { top: 4.1, left: 11.5, rotation: 116 },
        { top: 4.4, left: 14.1, rotation: 65 },
    ];

    return (
        <BunTop>
            {seeds.map((seed, index) => (
                <SesameSeed key={index} {...seed} />
            ))}
        </BunTop>
    );
}

export function LoadingBurger(props: BurgerProps) {
    const { size = 10 } = props;

    return (
        <TakeOutBox size={size}>
            <BunTopWithSesameSeeds />
            <Lettuce />
            <Tomato />
            <Cheese />
            <Patty />
            <BunBottom />
        </TakeOutBox>
    );
}
