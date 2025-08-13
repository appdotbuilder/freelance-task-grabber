<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Social Media Marketing',
            'Content Writing',
            'Data Entry',
            'Web Development',
            'Graphic Design',
            'Video Editing',
            'SEO Services',
            'Translation',
            'Customer Support',
            'Virtual Assistant'
        ];

        return [
            'admin_id' => User::factory(),
            'name' => fake()->randomElement($categories),
            'description' => fake()->paragraph(),
            'is_active' => fake()->boolean(85),
            'is_premium' => fake()->boolean(30),
            'expires_at' => fake()->optional(0.3)->dateTimeBetween('now', '+30 days'),
        ];
    }

    /**
     * Indicate that the category is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => true,
        ]);
    }

    /**
     * Indicate that the category is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'expires_at' => fake()->dateTimeBetween('+1 day', '+30 days'),
        ]);
    }
}