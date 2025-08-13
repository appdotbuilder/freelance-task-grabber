import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface UserTask {
    id: number;
    status: string;
    taken_at: string;
    expires_at: string;
    proof1_path?: string;
    proof2_path?: string;
    payment_status: string;
    admin_notes?: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    reward_amount: number;
    whatsapp_link: string;
    vcf_data?: string;
}

interface Category {
    id: number;
    name: string;
}

interface Admin {
    name: string;
}

interface Props {
    userTask: UserTask;
    task: Task;
    category: Category;
    admin: Admin;
    [key: string]: unknown;
}

export default function UserTaskShow({ userTask, task, category, admin }: Props) {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [proof1File, setProof1File] = useState<File | null>(null);
    const [proof2File, setProof2File] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const expires = new Date(userTask.expires_at).getTime();
            const now = new Date().getTime();
            const left = Math.max(0, expires - now);
            setTimeLeft(left);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [userTask.expires_at]);

    const formatTime = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleProofUpload = (type: 'proof1' | 'proof2') => {
        const file = type === 'proof1' ? proof1File : proof2File;
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append(type, file);
        formData.append('type', type);

        router.post(`/my-tasks/${task.id}/proof`, formData, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (type === 'proof1') setProof1File(null);
                if (type === 'proof2') setProof2File(null);
            }
        });
    };

    const getStatusDisplay = (status: string) => {
        const statusMap = {
            taken: { text: 'Task Taken', color: 'bg-blue-100 text-blue-800', emoji: '🎯' },
            proof1_uploaded: { text: 'Proof 1 Submitted', color: 'bg-yellow-100 text-yellow-800', emoji: '📸' },
            proof2_requested: { text: 'Proof 2 Requested', color: 'bg-orange-100 text-orange-800', emoji: '📋' },
            proof2_uploaded: { text: 'Proof 2 Submitted', color: 'bg-purple-100 text-purple-800', emoji: '📤' },
            completed: { text: 'Completed', color: 'bg-green-100 text-green-800', emoji: '✅' },
            failed: { text: 'Failed', color: 'bg-red-100 text-red-800', emoji: '❌' }
        };
        
        return statusMap[status as keyof typeof statusMap] || statusMap.taken;
    };

    const statusDisplay = getStatusDisplay(userTask.status);
    const isExpired = timeLeft === 0 && !['completed', 'failed'].includes(userTask.status);

    return (
        <AppShell>
            <Head title={`Task: ${task.title}`} />
            
            <div className="p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {task.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>📂 {category.name}</span>
                                <span>👤 {admin.name}</span>
                                <span className="font-medium text-indigo-600">💰 ${task.reward_amount}</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                            {statusDisplay.emoji} {statusDisplay.text}
                        </span>
                    </div>

                    {/* Countdown Timer */}
                    {!isExpired && !['completed', 'failed'].includes(userTask.status) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-medium">⏰ Time Remaining:</span>
                                    <span className="text-2xl font-mono font-bold text-red-700">
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                                <div className="text-sm text-red-600">
                                    Task expires at {new Date(userTask.expires_at).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    )}

                    {isExpired && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 text-red-800">
                                <span className="text-xl">⏰</span>
                                <span className="font-medium">Task has expired!</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Task Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Task Details</h2>
                    
                    <div className="prose prose-gray max-w-none mb-6">
                        <p>{task.description}</p>
                    </div>

                    {/* WhatsApp Link */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-green-900 mb-2">📱 WhatsApp Group</h3>
                        <a 
                            href={task.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:text-green-800 underline"
                        >
                            {task.whatsapp_link}
                        </a>
                    </div>

                    {/* VCF Data */}
                    {task.vcf_data && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 mb-2">📝 Additional Information</h3>
                            <pre className="text-sm text-blue-800 whitespace-pre-wrap">{task.vcf_data}</pre>
                        </div>
                    )}
                </div>

                {/* Proof Upload Section */}
                {!['completed', 'failed'].includes(userTask.status) && !isExpired && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📸 Submit Proof</h2>
                        
                        {/* Proof 1 */}
                        {userTask.status === 'taken' && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-3">Upload Proof 1</h3>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={(e) => setProof1File(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {proof1File && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Selected: {proof1File.name}</span>
                                            <Button
                                                onClick={() => handleProofUpload('proof1')}
                                                disabled={uploading}
                                                size="sm"
                                            >
                                                {uploading ? 'Uploading...' : 'Upload Proof 1'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Proof 1 Uploaded Status */}
                        {userTask.proof1_path && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✅</span>
                                    <span className="font-medium text-green-900">Proof 1 uploaded successfully!</span>
                                </div>
                                <p className="text-sm text-green-700 mt-1">Waiting for admin to review and request Proof 2 if needed.</p>
                            </div>
                        )}

                        {/* Proof 2 */}
                        {userTask.status === 'proof2_requested' && (
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Upload Proof 2 (Requested by Admin)</h3>
                                {userTask.admin_notes && (
                                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Admin Note:</strong> {userTask.admin_notes}
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={(e) => setProof2File(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                    {proof2File && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Selected: {proof2File.name}</span>
                                            <Button
                                                onClick={() => handleProofUpload('proof2')}
                                                disabled={uploading}
                                                size="sm"
                                                className="bg-orange-600 hover:bg-orange-700"
                                            >
                                                {uploading ? 'Uploading...' : 'Upload Proof 2'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Proof 2 Uploaded Status */}
                        {userTask.proof2_path && (
                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-600">✅</span>
                                    <span className="font-medium text-purple-900">Proof 2 uploaded successfully!</span>
                                </div>
                                <p className="text-sm text-purple-700 mt-1">Waiting for final admin verification.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Completed/Failed Status */}
                {userTask.status === 'completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">🎉</span>
                            <div>
                                <h3 className="text-xl font-semibold text-green-900">Task Completed!</h3>
                                <p className="text-green-700">Payment status: <strong>{userTask.payment_status}</strong></p>
                            </div>
                        </div>
                        {userTask.admin_notes && (
                            <div className="mt-3 p-3 bg-white border border-green-300 rounded-lg">
                                <p className="text-sm text-green-800">
                                    <strong>Admin Note:</strong> {userTask.admin_notes}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {userTask.status === 'failed' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">😞</span>
                            <div>
                                <h3 className="text-xl font-semibold text-red-900">Task Failed</h3>
                                <p className="text-red-700">This task was not completed successfully.</p>
                            </div>
                        </div>
                        {userTask.admin_notes && (
                            <div className="mt-3 p-3 bg-white border border-red-300 rounded-lg">
                                <p className="text-sm text-red-800">
                                    <strong>Admin Note:</strong> {userTask.admin_notes}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* File Upload Requirements */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">📋 Upload Requirements</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Accepted formats: JPG, PNG, WebP</li>
                        <li>• Maximum file size: 2MB</li>
                        <li>• Ensure images are clear and readable</li>
                        <li>• Upload proof of task completion</li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
}