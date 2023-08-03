import { LoginForm } from './LoginForm';

export const metadata = {
    metadataBase: new URL('https://www.wtf2cook.ca'),
    title: 'Login - WTF 2 Cook',
    description: 'Login to wtf2cook.ca for the best no bs recipes.',
};

export default function Login() {
    return <LoginForm />;
}
