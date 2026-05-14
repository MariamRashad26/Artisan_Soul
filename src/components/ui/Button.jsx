import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    to,
    onClick,
    ...props
}) => {
    const baseStyles = 'rounded-pill fw-bold fs-6 transition d-flex align-items-center justify-content-center gap-2 px-4 py-2 hover-elevate';

    const variants = {
        primary: 'bg-primary text-white hover:opacity-90 shadow-premium',
        secondary: 'bg-light text-dark hover:bg-white shadow-premium',
        outline: 'border border-primary text-primary hover:bg-primary-10',
        ghost: 'text-secondary hover:text-primary bg-transparent',
    };

    const classes = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
