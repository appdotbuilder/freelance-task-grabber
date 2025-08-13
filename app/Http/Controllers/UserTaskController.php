<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\UserTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserTaskController extends Controller
{
    /**
     * Display user's active task details.
     */
    public function show(Task $task)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        /** @var \App\Models\UserTask $userTask */
        $userTask = $user->userTasks()
            ->with(['task.category', 'task.admin'])
            ->where('task_id', $task->id)
            ->firstOrFail();

        // Full task details are only visible after taking the task
        return Inertia::render('user-tasks/show', [
            'userTask' => $userTask,
            'task' => $task,
            'category' => $task->category,
            'admin' => $task->admin
        ]);
    }

    /**
     * Upload proof 1 for a task.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'proof1' => 'required_without:proof2|file|mimes:jpg,jpeg,png,webp|max:2048',
            'proof2' => 'required_without:proof1|file|mimes:jpg,jpeg,png,webp|max:2048',
            'type' => 'required|in:proof1,proof2'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        /** @var \App\Models\UserTask $userTask */
        $userTask = $user->userTasks()
            ->where('task_id', $task->id)
            ->firstOrFail();

        $isExpired = $userTask->expires_at->lt(now()) && !in_array($userTask->status, ['completed', 'failed']);
        if ($isExpired) {
            return back()->with('error', 'This task has expired.');
        }

        $proofType = $request->type;
        $file = $request->file($proofType);
        
        // Store the file
        $path = $file->store('proofs', 'public');

        // Update the user task
        if ($proofType === 'proof1') {
            $userTask->update([
                'proof1_path' => $path,
                'status' => 'proof1_uploaded'
            ]);
            $message = 'Proof 1 uploaded successfully! Waiting for admin verification.';
        } else {
            $userTask->update([
                'proof2_path' => $path,
                'status' => 'proof2_uploaded'
            ]);
            $message = 'Proof 2 uploaded successfully! Waiting for final verification.';
        }

        return back()->with('success', $message);
    }


}