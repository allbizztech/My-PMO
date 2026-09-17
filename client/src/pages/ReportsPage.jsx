import React, { useState } from 'react';
import {
    Download, FileText, ArrowUpRight, ArrowDownRight,
    PieChart, DollarSign, TrendingUp, Receipt
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { DonutChart } from '../components/common/DonutChart';

export const ReportsPage = ({ projects = [] }) => {
    const formatCurrency = (val) => {
        let amount = Number(val) || 0;
        if (amount > 0 && amount < 10000) {
            amount = amount * 1000000;
        }
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Dynamic KPI calculations from live project data
    const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
    const totalSpent = projects.reduce((acc, p) => acc + (((Number(p.budget) || 0) * (Number(p.progress) || 0)) / 100), 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const pctUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const pctRemaining = Math.max(0, 100 - pctUsed);
    const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / projects.length) : 0;
    const highRiskCount = projects.filter(p => p.status === 'Lewat' || p.status === 'Berisiko' || p.health === 'Berisiko' || p.health === 'Amaran').length;

    // Dynamic Agency / Division Data breakdown
    const agencyMap = {};
    projects.forEach(p => {
        const agencyName = p.division || p.agency || 'Pejabat PMO';
        if (!agencyMap[agencyName]) {
            agencyMap[agencyName] = {
                name: agencyName,
                budget: 0,
                spent: 0,
                projects: 0,
                totalProgress: 0,
                hasRisk: false
            };
        }
        const b = Number(p.budget) || 0;
        const prog = Number(p.progress) || 0;
        agencyMap[agencyName].budget += b;
        agencyMap[agencyName].spent += (b * prog) / 100;
        agencyMap[agencyName].projects += 1;
        agencyMap[agencyName].totalProgress += prog;
        if (p.status === 'Lewat' || p.status === 'Berisiko' || p.health === 'Berisiko' || p.health === 'Amaran') {
            agencyMap[agencyName].hasRisk = true;
        }
    });

    let agencyData = Object.values(agencyMap).map(a => {
        const avgProg = a.projects > 0 ? Math.round(a.totalProgress / a.projects) : 0;
        let statusStr = 'Baik';
        if (a.hasRisk) statusStr = 'Berisiko';
        else if (avgProg === 100) statusStr = 'Selesai';
        else if (avgProg >= 75) statusStr = 'Cemerlang';

        return {
            name: a.name,
            budget: a.budget,
            spent: a.spent,
            projects: a.projects,
            efficiency: avgProg,
            status: statusStr
        };
    });

    if (agencyData.length === 0) {
        agencyData = [
            { name: 'Pejabat Ketua Pendaftar Mahkamah Persekutuan', budget: 0, spent: 0, projects: 0, efficiency: 0, status: 'Baik' }
        ];
    }

    // Dynamic Donut status percentages
    const totalProj = projects.length || 1;
    const completedCount = projects.filter(p => p.status === 'Selesai' || p.progress === 100).length;
    const activeCount = projects.filter(p => p.status === 'Aktif' && p.progress < 100).length;

    const completedPct = Math.round((completedCount / totalProj) * 100);
    const activePct = Math.round((activeCount / totalProj) * 100);
    const riskPct = Math.max(0, 100 - completedPct - activePct);

    const exportReportsToCSV = () => {
        if (!projects || projects.length === 0) return;
        const headers = ['Agensi / Bahagian', 'Projek Aktif', 'Jumlah Bajet (RM)', 'Jumlah Perbelanjaan (RM)', 'Kecekapan (%)', 'Status'];
        const rows = agencyData.map(a => [
            `"${(a.name || '').replace(/"/g, '""')}"`,
            `"${a.projects || 0}"`,
            `"${a.budget || 0}"`,
            `"${a.spent || 0}"`,
            `"${a.efficiency || 0}"`,
            `"${a.status || ''}"`
        ]);

        const csvContent = '\uFEFF' + [
            '=== LAPORAN RINGKASAN ANALITIK MY-PMO ===',
            '',
            '--- PECAHAN PRESTASI BAHAGIAN ---',
            headers.join(','),
            ...rows.map(r => r.join(',')),
            '',
            '--- SENARAI TERPERINCI PROJEK ---',
            ['ID Projek', 'Nama Projek', 'Bahagian', 'Pengurus', 'Bajet (RM)', 'Kemajuan (%)', 'Status'].join(','),
            ...projects.map(p => [
                `"${p.id || ''}"`,
                `"${(p.name || '').replace(/"/g, '""')}"`,
                `"${(p.division || p.agency || '').replace(/"/g, '""')}"`,
                `"${(p.manager || '').replace(/"/g, '""')}"`,
                `"${p.budget || 0}"`,
                `"${p.progress || 0}"`,
                `"${(p.status || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan_analitik_pmo_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with responsive flex layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                    <div className="flex items-center space-x-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Analitik Laporan</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline-block">Dinamik</span>
                    </div>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base">Prestasi kemajuan dan analisis kewangan projek secara masa nyata.</p>
                </div>

                {/* Export Action Buttons */}
                <div className="flex items-center space-x-2.5 self-start sm:self-auto shrink-0 print:hidden">
                    <button
                        onClick={exportReportsToCSV}
                        className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                        title="Eksport data ke fail Excel / CSV"
                    >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Eksport Excel</span>
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                        title="Cetak atau simpan sebagai PDF"
                    >
                        <FileText className="w-4 h-4 text-white" />
                        <span>Cetak / PDF</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { title: 'Jumlah Bajet Diperuntukkan', value: formatCurrency(totalBudget), icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', trend: `${projects.length} Projek`, isUp: true },
                    { title: 'Jumlah Perbelanjaan Sebenar', value: formatCurrency(totalSpent), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', trend: `${pctUsed}% Diguna`, isUp: true },
                    { title: 'Baki Peruntukan', value: formatCurrency(totalRemaining), icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', trend: `${pctRemaining}% Baki`, isUp: true },
                    { title: 'Kadar Pencapaian', value: `${avgProgress}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', trend: 'Purata Kemajuan', isUp: true },
                ].map((kpi, i) => (
                    <Card key={i} className="group hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl border ${kpi.bg} group-hover:scale-105 transition-transform duration-300`}>
                                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <div className="flex items-center text-xs font-extrabold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                {kpi.isUp ? <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" /> : <ArrowDownRight className="w-3 h-3 text-rose-500 mr-1" />}
                                <span className={kpi.isUp ? 'text-emerald-700' : 'text-rose-700'}>{kpi.trend}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug break-words" title={kpi.value}>
                                {kpi.value}
                            </h3>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">{kpi.title}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Financial Overview & Project Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Breakdown */}
                <Card className="lg:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Gambaran Kewangan Agensi</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Perbandingan perbelanjaan sebenar dan peruntukan bajet mengikut bahagian.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {agencyData.map(agency => {
                            const spentPct = agency.budget > 0 ? Math.min(100, Math.round((agency.spent / agency.budget) * 100)) : 0;
                            return (
                                <div key={agency.name} className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm">
                                        <span className="font-extrabold text-slate-800 line-clamp-1">{agency.name}</span>
                                        <span className="text-slate-500 font-semibold whitespace-nowrap">
                                            {formatCurrency(agency.spent)} <span className="text-slate-400">/</span> {formatCurrency(agency.budget)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex border border-slate-200/60 p-0.5">
                                        <div
                                            className="bg-gradient-to-r from-indigo-600 to-indigo-800 h-full relative group transition-all duration-1000 rounded-full shadow-sm"
                                            style={{ width: `${Math.max(spentPct, 4)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Status Projek Donut Chart */}
                <Card className="flex flex-col items-center justify-between relative overflow-hidden">
                    <div className="w-full mb-6 text-left">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Status Projek</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Pecahan status fizikal keseluruhan projek.</p>
                    </div>

                    <div className="relative py-4 my-auto">
                        <PieChart className="w-36 h-36 sm:w-40 sm:h-40 text-slate-100 absolute inset-0 m-auto pointer-events-none" strokeWidth={1} />
                        <DonutChart percentage={completedPct} colorClass="text-emerald-600" label="Selesai" />
                    </div>

                    <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2.5 shrink-0"></span> Selesai
                            </span>
                            <span className="font-extrabold text-slate-900">{completedPct}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2.5 shrink-0"></span> Dalam Kemajuan
                            </span>
                            <span className="font-extrabold text-slate-900">{activePct}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-600 font-medium flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2.5 shrink-0"></span> Berisiko / Lewat
                            </span>
                            <span className="font-extrabold text-slate-900">{riskPct}%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Division Performance Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Pecahan Prestasi Bahagian</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Analisis kecekapan dan peruntukan bajet mengikut unit/agensi.</p>
                    </div>
                </div>

                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                                <th className="px-6 py-4">Agensi / Bahagian</th>
                                <th className="px-6 py-4">Projek Aktif</th>
                                <th className="px-6 py-4">Jumlah Bajet</th>
                                <th className="px-6 py-4">Kecekapan Penghantaran</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {agencyData.map((agency, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-extrabold text-slate-900 max-w-[260px] truncate" title={agency.name}>
                                        {agency.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-semibold whitespace-nowrap">
                                        {agency.projects} Projek
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">
                                        {formatCurrency(agency.budget)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3 min-w-[140px]">
                                            <span className="font-extrabold text-slate-800 text-xs w-9 shrink-0">{agency.efficiency}%</span>
                                            <ProgressBar progress={agency.efficiency} colorClass={agency.efficiency >= 85 ? "bg-emerald-500" : agency.efficiency < 50 ? "bg-rose-500" : "bg-indigo-500"} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge text={agency.status} type={agency.status === 'Berisiko' ? 'Berisiko' : agency.status === 'Selesai' ? 'Selesai' : 'Baik'} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Projects Table (Hidden on Screen, Appears Only in Printed PDF) */}
            <div className="hidden print:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Senarai Terperinci Projek</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Maklumat terperinci status, bajet, dan kemajuan setiap projek.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 self-start sm:self-auto">
                        {projects.length} Projek Keseluruhan
                    </span>
                </div>

                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                                <th className="px-6 py-4">ID & Nama Projek</th>
                                <th className="px-6 py-4">Agensi / Bahagian</th>
                                <th className="px-6 py-4">Pengurus Projek (PMO)</th>
                                <th className="px-6 py-4">Jumlah Bajet (RM)</th>
                                <th className="px-6 py-4 text-center">Kemajuan (%)</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {projects.map((prj, idx) => (
                                <tr key={prj.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{prj.name}</div>
                                        <div className="inline-block bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 border border-slate-200">
                                            {prj.project_code || (String(prj.id).startsWith('PRJ-') ? prj.id : `PRJ-${String(prj.id).padStart(3, '0')}`)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-800">{prj.division || prj.agency || 'PKPMP'}</div>
                                        {prj.unit && <div className="text-[11px] font-medium text-slate-500">{prj.unit}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="font-bold text-slate-900">{prj.manager || 'Tiada'}</div>
                                        {prj.vendor_manager && <div className="text-slate-500 font-medium">{prj.vendor_manager}</div>}
                                    </td>
                                    <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                                        {formatCurrency(prj.budget)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className={`h-full rounded-full ${prj.progress > 75 ? "bg-emerald-500" : prj.progress < 50 ? "bg-amber-500" : "bg-indigo-500"}`}
                                                    style={{ width: `${Math.max(prj.progress || 0, 5)}%` }}
                                                />
                                            </div>
                                            <span className="font-extrabold text-slate-900 text-xs">{prj.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <Badge text={prj.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
