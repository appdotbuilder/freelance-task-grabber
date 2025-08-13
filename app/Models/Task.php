<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Task
 *
 * @property int $id
 * @property int $category_id
 * @property int $admin_id
 * @property string $title
 * @property string $description
 * @property string $difficulty
 * @property float $reward_amount
 * @property string $whatsapp_link
 * @property string|null $vcf_data
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task query()
 * @method static \Database\Factories\TaskFactory factory($count = null, $state = [])
 * @method static Task create(array $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Task active()
 * @method static \Illuminate\Database\Eloquent\Builder|Task available()
 * 
 * @mixin \Eloquent
 */
class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'admin_id',
        'title',
        'description',
        'difficulty',
        'reward_amount',
        'whatsapp_link',
        'vcf_data',
        'is_active',
        'expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'reward_amount' => 'decimal:2',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Scope a query to only include active tasks.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('expires_at', '>', now());
    }

    /**
     * Scope a query to only include available tasks (not taken).
     */
    public function scopeAvailable($query)
    {
        return $query->active()
                    ->whereDoesntHave('userTasks');
    }

    /**
     * Check if task is taken.
     */
    public function isTaken(): bool
    {
        return $this->userTasks()->exists();
    }

    /**
     * Category this task belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Admin who created this task.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * User tasks (users who took this task).
     */
    public function userTasks(): HasMany
    {
        return $this->hasMany(UserTask::class);
    }
}