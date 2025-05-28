import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TableDashboard from '@/Components/TableDashboard';
import SummaryCards from '@/Components/SummaryCards';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const { surveys } = usePage().props;

    const totalSurveys = surveys.length;
    const totalDraft = surveys.filter(s => s.status === 'draft').length;
    const totalOpen = surveys.filter(s => s.status === 'open').length;
    const totalResponses = surveys.reduce((acc, s) => acc + (s.responses_count || 0), 0); // pastikan field ini tersedia

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <SummaryCards
                        totalSurveys={totalSurveys}
                        totalDraft={totalDraft}
                        totalOpen={totalOpen}
                        totalResponses={totalResponses}
                    />
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <TableDashboard />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
