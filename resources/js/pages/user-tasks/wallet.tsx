import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface UserTask {
    id: number;
    completed_at: string;
    payment_status: string;
    task: {
        title: string;
        reward_amount: number;
        difficulty: string;
        category: {
            name: string;
        };
        admin: {
            name: string;
        };
    };
}

interface Props {
    userTasks: {
        data: UserTask[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
    };
    totalTasks: number;
    totalEarnings: number;
    todayEarnings: number;
    badge: string;
    [key: string]: unknown;
}

const badgeEmojis = {
    'Junior': '🥉',
    'Senior': '🥈',
    'God': '🏆'
};

const difficultyEmojis = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴'
};

export default function Wallet({ userTasks, totalTasks, totalEarnings, todayEarnings, badge }: Props) {
    return (
        <AppShell>
            <Head title="Wallet History" />
            
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Wallet History</h1>
                    <p className="text-gray-600">
                        Track your earnings and task completion history
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Total Earnings</p>
                                <p className="text-2xl font-bold text-green-900">${totalEarnings.toFixed(2)}</p>
                            </div>
                            <div className="text-3xl text-green-500">💵</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Today's Earnings</p>
                                <p className="text-2xl font-bold text-blue-900">${todayEarnings.toFixed(2)}</p>
                            </div>
                            <div className="text-3xl text-blue-500">📅</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Completed Tasks</p>
                                <p className="text-2xl font-bold text-purple-900">{totalTasks}</p>
                            </div>
                            <div className="text-3xl text-purple-500">✅</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Current Badge</p>
                                <p className="text-2xl font-bold text-yellow-900">{badge}</p>
                            </div>
                            <div className="text-3xl">
                                {badgeEmojis[badge as keyof typeof badgeEmojis] || '🏅'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badge Progress */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Badge Progress</h2>
                    
                    <div className="space-y-4">
                        {/* Junior Badge */}
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">🥉</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-900">Junior Badge</span>
                                    <span className="text-sm text-gray-600">0 - 29 tasks</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-orange-400 h-2 rounded-full" 
                                        style={{ width: totalTasks >= 30 ? '100%' : `${Math.min((totalTasks / 30) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            {totalTasks < 30 && (
                                <span className="text-sm font-medium text-orange-600">
                                    {30 - totalTasks} more
                                </span>
                            )}
                            {totalTasks >= 30 && <span className="text-green-600 font-medium">✓</span>}
                        </div>

                        {/* Senior Badge */}
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">🥈</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-900">Senior Badge</span>
                                    <span className="text-sm text-gray-600">30 - 99 tasks</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-gray-400 h-2 rounded-full" 
                                        style={{ 
                                            width: totalTasks >= 100 ? '100%' : totalTasks < 30 ? '0%' : `${((totalTasks - 30) / 70) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                            {totalTasks < 100 && totalTasks >= 30 && (
                                <span className="text-sm font-medium text-gray-600">
                                    {100 - totalTasks} more
                                </span>
                            )}
                            {totalTasks >= 100 && <span className="text-green-600 font-medium">✓</span>}
                        </div>

                        {/* God Badge */}
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">🏆</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-900">God Badge</span>
                                    <span className="text-sm text-gray-600">100+ tasks</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-yellow-500 h-2 rounded-full" 
                                        style={{ width: totalTasks >= 100 ? '100%' : '0%' }}
                                    ></div>
                                </div>
                            </div>
                            {totalTasks >= 100 && <span className="text-yellow-600 font-medium">👑</span>}
                        </div>
                    </div>
                </div>

                {/* Task History */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">📋 Recent Earnings</h2>
                    </div>

                    {userTasks.data.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {userTasks.data.map((userTask) => (
                                <div key={userTask.id} className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-medium text-gray-900">
                                                    {userTask.task.title}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {difficultyEmojis[userTask.task.difficulty as keyof typeof difficultyEmojis]} 
                                                    {userTask.task.difficulty}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                <span>📂 {userTask.task.category.name}</span>
                                                <span>👤 {userTask.task.admin.name}</span>
                                                <span>📅 {new Date(userTask.completed_at).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    userTask.payment_status === 'success' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : userTask.payment_status === 'failed'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {userTask.payment_status === 'success' ? '✅ Paid' : 
                                                     userTask.payment_status === 'failed' ? '❌ Failed' : '⏳ Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-600">
                                                ${userTask.task.reward_amount}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(userTask.completed_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">💸</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No earnings yet
                            </h3>
                            <p className="text-gray-600">
                                Complete your first task to start building your earning history!
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">📊 Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                                ${totalTasks > 0 ? (totalEarnings / totalTasks).toFixed(2) : '0.00'}
                            </div>
                            <div className="text-sm text-gray-600">Average per Task</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                                {Math.round((totalTasks / Math.max(1, Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)))) * 7) || 0}
                            </div>
                            <div className="text-sm text-gray-600">Tasks per Week</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                                {badge}
                            </div>
                            <div className="text-sm text-gray-600">Current Rank</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}