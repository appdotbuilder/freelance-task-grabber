<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tasks = [
            'Create 10 Instagram posts',
            'Write a 500-word blog article',
            'Design a company logo',
            'Data entry for 100 records',
            'Create a promotional video',
            'Translate 5 pages of content',
            'Optimize website SEO',
            'Customer support for 2 hours',
            'Create social media graphics',
            'Write product descriptions'
        ];

        $difficulties = ['easy', 'medium', 'hard'];
        $rewards = ['easy' => [10, 25], 'medium' => [26, 50], 'hard' => [51, 100]];
        
        $difficulty = fake()->randomElement($difficulties);
        $rewardRange = $rewards[$difficulty];

        return [
            'category_id' => Category::factory(),
            'admin_id' => fn(array $attributes) => Category::find($attributes['category_id'])->admin_id,
            'title' => fake()->randomElement($tasks),
            'description' => fake()->paragraphs(3, true),
            'difficulty' => $difficulty,
            'reward_amount' => fake()->randomFloat(2, $rewardRange[0], $rewardRange[1]),
            'whatsapp_link' => 'https://chat.whatsapp.com/' . fake()->regexify('[A-Za-z0-9]{22}'),
            'vcf_data' => fake()->optional(0.4)->text(200),
            'is_active' => fake()->boolean(90),
            'expires_at' => fake()->dateTimeBetween('+1 hour', '+7 days'),
        ];
    }

    /**
     * Indicate that the task is active and available.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'expires_at' => fake()->dateTimeBetween('+1 hour', '+7 days'),
        ]);
    }

    /**
     * Create an easy task.
     */
    public function easy(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'easy',
            'reward_amount' => fake()->randomFloat(2, 10, 25),
        ]);
    }

    /**
     * Create a medium task.
     */
    public function medium(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'medium',
            'reward_amount' => fake()->randomFloat(2, 26, 50),
        ]);
    }

    /**
     * Create a hard task.
     */
    public function hard(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'hard',
            'reward_amount' => fake()->randomFloat(2, 51, 100),
        ]);
    }
}