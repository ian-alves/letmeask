import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    // ? opcional
    isOutlined?: boolean
};

// ... = rest operator
export function Button({ isOutlined = false, ...props }: ButtonProps) {

    return (
        <button
            className={`button ${isOutlined ? 'outlined' : ''}`}
            {...props}
        />
    )
}