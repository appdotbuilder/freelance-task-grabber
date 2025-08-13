<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['taken', 'proof1_uploaded', 'proof2_requested', 'proof2_uploaded', 'completed', 'failed'])->default('taken');
            $table->timestamp('taken_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at'); // 10 minutes after taken_at
            $table->string('proof1_path')->nullable();
            $table->string('proof2_path')->nullable();
            $table->enum('payment_status', ['pending', 'success', 'failed'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'task_id']);
            $table->index('user_id');
            $table->index('task_id');
            $table->index('status');
            $table->index('taken_at');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_tasks');
    }
};