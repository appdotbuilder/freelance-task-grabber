<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalletController extends Controller
{
    /**
     * Display user's wallet history.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $userTasks = $user->userTasks()
            ->with(['task.category', 'task.admin'])
            ->where('payment_status', 'success')
            ->latest('completed_at')
            ->paginate(20);

        $todayEarnings = $user->userTasks()
            ->join('tasks', 'user_tasks.task_id', '=', 'tasks.id')
            ->where('payment_status', 'success')
            ->where('completed_at', '>=', today())
            ->sum('tasks.reward_amount');

        return Inertia::render('user-tasks/wallet', [
            'userTasks' => $userTasks,
            'totalTasks' => $user->successful_tasks_count,
            'totalEarnings' => $user->total_earnings,
            'todayEarnings' => $todayEarnings,
            'badge' => $user->getBadge()
        ]);
    }
}