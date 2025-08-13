<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Task;
use App\Models\UserTask;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display the main task browsing interface.
     */
    public function index()
    {
        // If user is not authenticated, show welcome page
        if (!Auth::check()) {
            return Inertia::render('welcome', [
                'canLogin' => true,
                'canRegister' => true
            ]);
        }

        $categories = Category::with(['admin'])
            ->withCount(['tasks' => function($query) {
                $query->where('is_active', true)
                     ->where('expires_at', '>', now())
                     ->whereDoesntHave('userTasks');
            }])
            ->with(['tasks' => function($query) {
                $query->where('is_active', true)
                     ->where('expires_at', '>', now())
                     ->whereDoesntHave('userTasks')
                     ->take(5);
            }])
            ->active()
            ->orderBy('is_premium', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tasks/index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show tasks within a specific category.
     */
    public function show(Category $category)
    {
        $tasks = $category->tasks()
            ->with(['admin', 'userTasks'])
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->whereDoesntHave('userTasks')
            ->latest()
            ->paginate(20);

        return Inertia::render('tasks/show', [
            'category' => $category->load('admin'),
            'tasks' => $tasks
        ]);
    }

    /**
     * Take a task (user grabs a task).
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        /** @var \App\Models\Task $task */
        $task = Task::findOrFail($request->task_id);

        // Check if user already has an active task
        $activeTask = $user->userTasks()
            ->whereNotIn('status', ['completed', 'failed'])
            ->first();

        if ($activeTask) {
            return back()->with('error', 'You already have an active task. Complete it first.');
        }

        // Check if task is still available
        if ($task->isTaken()) {
            return back()->with('error', 'This task has already been taken by another user.');
        }

        // Use database transaction to prevent race conditions
        DB::transaction(function () use ($user, $task) {
            UserTask::create([
                'user_id' => $user->id,
                'task_id' => $task->id,
                'status' => 'taken',
                'taken_at' => now(),
                'expires_at' => now()->addMinutes(10), // 10-minute countdown
                'payment_status' => 'pending'
            ]);
        });

        return redirect()->route('user-tasks.show', $task->id)
            ->with('success', 'Task taken successfully! You have 10 minutes to complete it.');
    }
}