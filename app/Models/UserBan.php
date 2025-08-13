<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\UserBan
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $banned_by
 * @property string $type
 * @property string $reason
 * @property \Illuminate\Support\Carbon $banned_at
 * @property \Illuminate\Support\Carbon $expires_at
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|UserBan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserBan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserBan query()

 * @method static UserBan create(array $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserBan active()
 * 
 * @mixin \Eloquent
 */
class UserBan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'banned_by',
        'type',
        'reason',
        'banned_at',
        'expires_at',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'banned_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope a query to only include active bans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('expires_at', '>', now());
    }

    /**
     * User who was banned.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * User who issued the ban.
     */
    public function bannedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'banned_by');
    }
}