'use client';
import {
    BunBottom,
    BunTopWithSesameSeeds,
    Cheese,
    Lettuce,
    Patty,
    TakeOutBox,
    Tomato,
} from './Burger.styles';

export type BurgerProps = {
    size?: number;
};

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
