import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Task {
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    reward_amount: number;
    expires_at: string;
    is_taken?: boolean;
}

interface Category {
    id: number;
    name: string;
    description: string;
    is_premium: boolean;
    admin: {
        name: string;
        is_premium: boolean;
    };
}

interface Props {
    category: Category;
    tasks: {
        data: Task[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
    };
    [key: string]: unknown;
}

const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
};

const difficultyEmojis = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴'
};

export default function TasksShow({ category, tasks }: Props) {
    const [takingTask, setTakingTask] = useState<number | null>(null);

    const handleTakeTask = (taskId: number) => {
        setTakingTask(taskId);
        router.post('/tasks/take', { task_id: taskId }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setTakingTask(null),
            onError: () => setTakingTask(null)
        });
    };

    const getTimeLeft = (expiresAt: string) => {
        const timeLeft = new Date(expiresAt).getTime() - new Date().getTime();
        const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
        const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
        
        if (hoursLeft > 0) {
            return `${hoursLeft}h ${minutesLeft}m`;
        }
        return `${minutesLeft}m`;
    };

    return (
        <AppShell>
            <Head title={`${category.name} - Tasks`} />
            
            <div className="p-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">🏠 Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{category.name}</span>
                </nav>

                {/* Category Header */}
                <div className={`rounded-xl p-6 mb-8 ${
                    category.is_premium 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200' 
                        : 'bg-white border border-gray-200'
                }`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {category.name}
                                </h1>
                                {category.is_premium && (
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        ⭐ Premium
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-4 max-w-2xl">
                                {category.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">Created by</span>
                                <span className="font-medium text-indigo-600">
                                    {category.is_premium ? '⭐' : '👤'} {category.admin.name}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">
                                {tasks.data.length}
                            </div>
                            <div className="text-sm text-gray-500">Available Tasks</div>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                <div className="space-y-4">
                    {tasks.data.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {task.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[task.difficulty]}`}>
                                            {difficultyEmojis[task.difficulty]} {task.difficulty}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <span>💰</span>
                                            <span className="font-semibold text-indigo-600 text-lg">
                                                ${task.reward_amount}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⏰</span>
                                            <span>Expires in {getTimeLeft(task.expires_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⚡</span>
                                            <span>10 min completion time</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-sm text-gray-500">
                                        💡 Full details revealed after taking the task
                                    </div>
                                </div>

                                <div className="ml-6">
                                    <Button
                                        onClick={() => handleTakeTask(task.id)}
                                        disabled={takingTask === task.id}
                                        className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
                                    >
                                        {takingTask === task.id ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin">⏳</span>
                                                Taking...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                🎯 Grab Task
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {tasks.data.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tasks available in this category
                        </h3>
                        <p className="text-gray-600 mb-6">
                            All tasks have been taken or have expired. Check back soon!
                        </p>
                        <Link href="/">
                            <Button variant="outline">
                                🔙 Browse Other Categories
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {tasks.last_page > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                            {tasks.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        link.active 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="mt-12 bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">💡 Quick Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">⚡ Act Fast:</span>
                            <span className="text-gray-600 ml-2">Tasks are first-come, first-served</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">⏰ 10 Minutes:</span>
                            <span className="text-gray-600 ml-2">Complete tasks within the time limit</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">📸 Upload Proof:</span>
                            <span className="text-gray-600 ml-2">Submit proof for verification</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">💰 Get Paid:</span>
                            <span className="text-gray-600 ml-2">Earnings added after admin approval</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}