import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'flex items-center px-4 py-2 text-xl font-semibold rounded-lg transition duration-150 ease-in-out ' +
                (active
                    ? 'bg-white text-[#34495E] shadow-md'  // Tampilan untuk menu yang aktif
                    : 'text-[#E4F1FE] hover:text-white hover:bg-gray-700 ') + // Tampilan menu tidak aktif
                className
            }
        >
            {children}
        </Link>
    );
}
