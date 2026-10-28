import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Download, FileText, ArrowUpRight, ArrowDownRight,
    PieChart, DollarSign, TrendingUp, Receipt, Target
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
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Laporan Analitik Prestasi & Kewangan</h1>
                    <p className="text-slate-500 mt-1 text-xs sm:text-sm">Analisis status kemajuan fizikal dan prestasi perbelanjaan peruntukan projek PKPMP.</p>
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

            {/* --- DEDICATED PRINTABLE PDF DOCUMENT (RENDERED DIRECTLY INTO #print-root IN BODY) --- */}
            {typeof document !== 'undefined' && document.getElementById('print-root') && createPortal(
                <div className="font-sans text-slate-900 w-full bg-white p-6 max-w-5xl mx-auto leading-normal">
                    {/* Kepala Surat Rasmi Kerajaan / PKPMP */}
                    <div className="border-b-2 border-slate-900 pb-4 mb-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3.5">
                                <img src="/My-PMO/logo.png" alt="Logo PKPMP" className="w-14 h-14 object-contain shrink-0" />
                                <div>
                                    <h1 className="text-sm font-black tracking-tight text-slate-900 uppercase">
                                        Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)
                                    </h1>
                                    <h2 className="text-[11px] font-bold text-slate-700 uppercase">
                                        Bahagian Teknologi Maklumat & Pejabat Pengurusan Projek (MY-PMO)
                                    </h2>
                                    <p className="text-[9px] text-slate-500 mt-0.5">
                                        Istana Kehakiman, Presint 3, 62506 Putrajaya, Wilayah Persekutuan Putrajaya
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0 border border-slate-300 p-2 rounded-lg bg-slate-50 text-[9px]">
                                <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold rounded mb-1 border border-rose-200">
                                    SULIT & TERPERINGKAT
                                </span>
                                <div className="text-slate-600 font-medium">No. Rujukan: <strong className="text-slate-900">{`PKPMP/BTM/PMO-FIN/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(projects.length).padStart(3, '0')}`}</strong></div>
                                <div className="text-slate-600 font-medium">Tarikh Cetakan: <strong className="text-slate-900">{new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
                            </div>
                        </div>
                    </div>

                    {/* Tajuk Utama Laporan */}
                    <div className="mb-5 bg-slate-100 border border-slate-300 p-3.5 rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                                Laporan Eksekutif Prestasi Portfolio & Analitik Kewangan Projek
                            </h2>
                            <p className="text-[10px] text-slate-600 mt-0.5">
                                Penyata Kedudukan Peruntukan Bajet, Perbelanjaan Sebenar, dan Kemajuan Fizikal Projek Sistem Mahkamah
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full border border-indigo-200">
                                {projects.length} Inisiatif Projek
                            </span>
                        </div>
                    </div>

                    {/* Ringkasan Eksekutif KPI (4 Kotak Ringkasan Kewangan) */}
                    <div className="mb-5 break-inside-avoid">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1.5"></span>
                            1.0 Ringkasan Eksekutif Kedudukan Kewangan & Fizikal
                        </h3>
                        <div className="grid grid-cols-4 gap-2.5">
                            <div className="p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                                <div className="text-[9px] font-bold text-slate-500 uppercase">Jumlah Bajet Disediakan</div>
                                <div className="text-xs font-black text-slate-900 mt-1">{formatCurrency(totalBudget)}</div>
                                <div className="text-[9px] text-indigo-700 font-bold mt-0.5">100% Siling Peruntukan</div>
                            </div>
                            <div className="p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                                <div className="text-[9px] font-bold text-slate-500 uppercase">Perbelanjaan Sebenar</div>
                                <div className="text-xs font-black text-emerald-700 mt-1">{formatCurrency(totalSpent)}</div>
                                <div className="text-[9px] text-emerald-700 font-bold mt-0.5">{pctUsed}% daripada Bajet</div>
                            </div>
                            <div className="p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                                <div className="text-[9px] font-bold text-slate-500 uppercase">Baki Peruntukan</div>
                                <div className="text-xs font-black text-amber-700 mt-1">{formatCurrency(totalRemaining)}</div>
                                <div className="text-[9px] text-amber-700 font-bold mt-0.5">{pctRemaining}% Baki Sedia Ada</div>
                            </div>
                            <div className="p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                                <div className="text-[9px] font-bold text-slate-500 uppercase">Purata Kemajuan Fizikal</div>
                                <div className="text-xs font-black text-blue-700 mt-1">{avgProgress}%</div>
                                <div className="text-[9px] text-blue-700 font-bold mt-0.5">
                                    {completedCount} Selesai &bull; {activeCount} Aktif &bull; {highRiskCount} Berisiko
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jadual Pecahan Kewangan Mengikut Bahagian */}
                    <div className="mb-5 break-inside-avoid">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1.5"></span>
                            2.0 Pecahan Prestasi & Kewangan Mengikut Bahagian / Agensi
                        </h3>
                        <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                            <thead>
                                <tr className="bg-slate-200 border-b border-slate-300 text-slate-800 font-extrabold uppercase">
                                    <th className="p-1.5 border-r border-slate-300 w-8 text-center">Bil</th>
                                    <th className="p-1.5 border-r border-slate-300">Bahagian / Agensi</th>
                                    <th className="p-1.5 border-r border-slate-300 text-center w-20">Bil. Projek</th>
                                    <th className="p-1.5 border-r border-slate-300 text-right w-28">Peruntukan Bajet (RM)</th>
                                    <th className="p-1.5 border-r border-slate-300 text-right w-28">Perbelanjaan (RM)</th>
                                    <th className="p-1.5 border-r border-slate-300 text-right w-28">Baki Bajet (RM)</th>
                                    <th className="p-1.5 border-r border-slate-300 text-center w-20">Kecekapan (%)</th>
                                    <th className="p-1.5 text-center w-20">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {agencyData.map((agency, i) => {
                                    const remaining = Math.max(0, agency.budget - agency.spent);
                                    return (
                                        <tr key={i} className="even:bg-slate-50">
                                            <td className="p-1.5 border-r border-slate-300 text-center font-bold">{i + 1}</td>
                                            <td className="p-1.5 border-r border-slate-300 font-bold text-slate-900">{agency.name}</td>
                                            <td className="p-1.5 border-r border-slate-300 text-center">{agency.projects}</td>
                                            <td className="p-1.5 border-r border-slate-300 text-right font-medium">{formatCurrency(agency.budget)}</td>
                                            <td className="p-1.5 border-r border-slate-300 text-right font-medium text-emerald-700">{formatCurrency(agency.spent)}</td>
                                            <td className="p-1.5 border-r border-slate-300 text-right font-medium text-amber-700">{formatCurrency(remaining)}</td>
                                            <td className="p-1.5 border-r border-slate-300 text-center font-bold">{agency.efficiency}%</td>
                                            <td className="p-1.5 text-center font-bold">
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                                    agency.status === 'Berisiko' ? 'bg-rose-100 text-rose-800' :
                                                    agency.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {agency.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-200 font-black border-t-2 border-slate-400">
                                    <td colSpan="2" className="p-1.5 border-r border-slate-300 text-right uppercase">Jumlah Keseluruhan:</td>
                                    <td className="p-1.5 border-r border-slate-300 text-center">{projects.length}</td>
                                    <td className="p-1.5 border-r border-slate-300 text-right">{formatCurrency(totalBudget)}</td>
                                    <td className="p-1.5 border-r border-slate-300 text-right text-emerald-800">{formatCurrency(totalSpent)}</td>
                                    <td className="p-1.5 border-r border-slate-300 text-right text-amber-800">{formatCurrency(totalRemaining)}</td>
                                    <td className="p-1.5 border-r border-slate-300 text-center">{avgProgress}%</td>
                                    <td className="p-1.5 text-center">-</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Jadual Terperinci Portfolio Projek */}
                    <div className="mb-5 break-inside-avoid">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1.5"></span>
                            3.0 Senarai Terperinci Portfolio Projek & Kemajuan Fizikal
                        </h3>
                        <table className="w-full text-left border-collapse border border-slate-300 text-[9px]">
                            <thead>
                                <tr className="bg-slate-200 border-b border-slate-300 text-slate-800 font-extrabold uppercase">
                                    <th className="p-1.5 border-r border-slate-300 w-8 text-center">Bil</th>
                                    <th className="p-1.5 border-r border-slate-300 w-20">Kod Projek</th>
                                    <th className="p-1.5 border-r border-slate-300">Nama Inisiatif / Projek</th>
                                    <th className="p-1.5 border-r border-slate-300 w-28">Bahagian</th>
                                    <th className="p-1.5 border-r border-slate-300 w-24">Pengurus PMO</th>
                                    <th className="p-1.5 border-r border-slate-300 text-right w-24">Bajet (RM)</th>
                                    <th className="p-1.5 border-r border-slate-300 text-center w-14">Kemajuan</th>
                                    <th className="p-1.5 text-center w-18">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {projects.map((p, idx) => (
                                    <tr key={p.id || idx} className="even:bg-slate-50">
                                        <td className="p-1 border-r border-slate-300 text-center font-bold">{idx + 1}</td>
                                        <td className="p-1 border-r border-slate-300 font-mono font-bold text-slate-700">
                                            {p.project_code || p.projectCode || `PRJ-${String(p.id).padStart(3, '0')}`}
                                        </td>
                                        <td className="p-1 border-r border-slate-300 font-bold text-slate-900">{p.name}</td>
                                        <td className="p-1 border-r border-slate-300 text-slate-700">{p.division || p.agency || 'PKPMP'}</td>
                                        <td className="p-1 border-r border-slate-300 text-slate-700">{p.manager || 'Pegawai PMO'}</td>
                                        <td className="p-1 border-r border-slate-300 text-right font-bold whitespace-nowrap">{formatCurrency(p.budget)}</td>
                                        <td className="p-1 border-r border-slate-300 text-center font-black">{p.progress}%</td>
                                        <td className="p-1 text-center font-bold">
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                                                p.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                                                p.status === 'Lewat' || p.status === 'Berisiko' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {p.status || 'Aktif'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pengesahan Rasmi & Tandatangan Pegawai */}
                    <div className="mt-6 pt-3 border-t-2 border-slate-300 break-inside-avoid">
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1.5"></span>
                            4.0 Pengesahan Dokumen & Perakuan Rasmi
                        </h3>
                        <div className="grid grid-cols-2 gap-6 text-[10px]">
                            <div className="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <div className="font-bold text-slate-500 uppercase text-[9px] mb-6">Disediakan Oleh (Pegawai Penjana):</div>
                                <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                                    Nama: ................................................................
                                </div>
                                <div className="text-slate-600">Jawatan: Pegawai Tadbir / Teknologi Maklumat</div>
                                <div className="text-slate-600">Pejabat Pengurusan Projek (MY-PMO) PKPMP</div>
                                <div className="text-slate-500 text-[9px] mt-1.5">Tarikh: {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                            <div className="border border-slate-300 p-3 rounded-lg bg-slate-50">
                                <div className="font-bold text-slate-500 uppercase text-[9px] mb-6">Disahkan & Diperakukan Oleh:</div>
                                <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                                    Nama: ................................................................
                                </div>
                                <div className="text-slate-600">Jawatan: Pengarah / Ketua Penolong Kanan Pendaftar</div>
                                <div className="text-slate-600">Bahagian Teknologi Maklumat, PKPMP</div>
                                <div className="text-slate-500 text-[9px] mt-1.5">Tarikh: .........................................</div>
                            </div>
                        </div>

                        {/* Footer Nota Keselamatan Rasmi */}
                        <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-500">
                            <div>
                                Dokumen dijana secara automatik oleh <strong>Sistem Pengurusan & Pemantauan Projek (MY-PMO v2.4)</strong>.
                            </div>
                            <div className="font-mono">
                                Halaman 1 daripada 1 &bull; Cetakan Rasmi Kerajaan
                            </div>
                        </div>
                    </div>
                </div>,
                document.getElementById('print-root')
            )}
        </div>
    );
};
