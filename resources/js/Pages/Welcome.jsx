import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {!auth.user ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Silakan login terlebih dahulu</h2>
                            <Link
                                href={route('login')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <p>Selamat datang, {auth.user.name}!</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
