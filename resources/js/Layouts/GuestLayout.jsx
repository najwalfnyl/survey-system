import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0  bg-[#EDF6FF]">
            

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white overflow-hidden border border-[#34495E] sm:rounded-lg">
                <div className="flex flex-col justify-center items-center mb-2">
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#34495E] mt-4">Hi, Welcome Back!</h1>
                </div>
                {children}
            </div>
        </div>
    );
}
