import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
    description: string;
    is_premium: boolean;
    tasks_count?: number;
    admin: {
        name: string;
        is_premium: boolean;
    };
    tasks: Task[];
}

interface Task {
    id: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    reward_amount: number;
    expires_at: string;
}

interface Props {
    categories: Category[];
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

function TaskCard({ task }: { task: Task }) {
    const timeLeft = new Date(task.expires_at).getTime() - new Date().getTime();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm truncate pr-2">
                    {task.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[task.difficulty]}`}>
                    {difficultyEmojis[task.difficulty]} {task.difficulty}
                </span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-indigo-600">${task.reward_amount}</span>
                <span className="text-gray-500">⏰ {hoursLeft}h left</span>
            </div>
        </div>
    );
}

export default function TasksIndex({ categories }: Props) {
    const premiumCategories = categories.filter(c => c.is_premium);
    const regularCategories = categories.filter(c => !c.is_premium);

    return (
        <AppShell>
            <Head title="Task Categories - Freelance Task Grabber" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Task Categories</h1>
                    <p className="text-gray-600">
                        Browse available task categories and grab opportunities before others do!
                    </p>
                </div>

                {/* Premium Categories */}
                {premiumCategories.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">⭐ Premium Categories</h2>
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                Priority Access
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {premiumCategories.map((category) => (
                                <div key={category.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {category.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {category.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500">by</span>
                                                <span className="font-medium text-indigo-600">
                                                    ⭐ {category.admin.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sample Tasks Preview */}
                                    <div className="space-y-2 mb-4">
                                        {category.tasks.slice(0, 3).map((task) => (
                                            <TaskCard key={task.id} task={task} />
                                        ))}
                                        {category.tasks.length > 3 && (
                                            <div className="text-center py-2 text-sm text-gray-500">
                                                +{category.tasks.length - 3} more tasks
                                            </div>
                                        )}
                                    </div>

                                    <Link href={`/categories/${category.id}/tasks`}>
                                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                                            🚀 View {category.tasks.length} Tasks
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regular Categories */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 All Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularCategories.map((category) => (
                            <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {category.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500">by</span>
                                            <span className="font-medium text-gray-700">
                                                {category.admin.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sample Tasks Preview */}
                                <div className="space-y-2 mb-4">
                                    {category.tasks.slice(0, 3).map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                    {category.tasks.length > 3 && (
                                        <div className="text-center py-2 text-sm text-gray-500">
                                            +{category.tasks.length - 3} more tasks
                                        </div>
                                    )}
                                </div>

                                <Link href={`/categories/${category.id}/tasks`}>
                                    <Button variant="outline" className="w-full">
                                        📝 View {category.tasks.length} Tasks
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No categories available yet
                        </h3>
                        <p className="text-gray-600">
                            Check back soon for new task opportunities!
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}