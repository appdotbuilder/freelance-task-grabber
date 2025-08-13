<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\UserTask
 *
 * @property int $id
 * @property int $user_id
 * @property int $task_id
 * @property string $status
 * @property \Illuminate\Support\Carbon $taken_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon $expires_at
 * @property string|null $proof1_path
 * @property string|null $proof2_path
 * @property string $payment_status
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|UserTask newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserTask newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserTask query()

 * @method static UserTask create(array $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserTask active()
 * @method static \Illuminate\Database\Eloquent\Builder|UserTask expired()
 * 
 * @mixin \Eloquent
 */
class UserTask extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'task_id',
        'status',
        'taken_at',
        'completed_at',
        'expires_at',
        'proof1_path',
        'proof2_path',
        'payment_status',
        'admin_notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'taken_at' => 'datetime',
            'completed_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Scope a query to only include active user tasks.
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now())
                    ->whereNotIn('status', ['completed', 'failed']);
    }

    /**
     * Scope a query to only include expired user tasks.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now())
                    ->whereNotIn('status', ['completed', 'failed']);
    }

    /**
     * Check if task is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now() && !in_array($this->status, ['completed', 'failed']);
    }

    /**
     * User who took this task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Task that was taken.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}