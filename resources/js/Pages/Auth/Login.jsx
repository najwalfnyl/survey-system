import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { setAuthToken } from '../../services/api';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
    
        post(route('login'), {
            onSuccess: () => {
                // Setelah login Breeze sukses, ambil token dari API login
                axios.post('/api/login', {
                    email: data.email,
                    password: data.password
                })
                .then((res) => {
                    const token = res.data.token;
                    localStorage.setItem('token', token);
                    setAuthToken(token);
                    console.log('Token berhasil disimpan');
                })
                .catch((err) => {
                    console.error('Gagal ambil token:', err);
                });
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex justify-between items-center mt-4">
                <label className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-gray-600">Remember me</span>
                </label>

                {canResetPassword && (
                    <Link
                        href={route('password.request')}
                        className="text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Forgot your password?
                    </Link>
                )}
            </div>

            <div className="mt-4">
                <PrimaryButton 
                    className="w-full bg-[#0F5AA2] text-white text-sm py-1 rounded-md"
                    disabled={processing}
                >
                    Log in
                </PrimaryButton>
            </div>
            </form>
        </GuestLayout>
    );
}
