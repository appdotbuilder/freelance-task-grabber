<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class FreelanceTaskGrabberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create superadmin
        $superadmin = User::factory()->superadmin()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@taskgrabber.com',
        ]);

        // Create 3 admins (1 premium, 2 regular)
        $premiumAdmin = User::factory()->premiumAdmin()->create([
            'name' => 'Premium Admin',
            'email' => 'premium@taskgrabber.com',
        ]);

        $admins = User::factory()->admin()->count(2)->create();
        $allAdmins = collect([$premiumAdmin])->concat($admins);

        // Create 30 regular users
        $users = User::factory()->regularUser()->count(30)->create();

        // Create a test user for easy login
        User::factory()->regularUser()->create([
            'name' => 'Test User',
            'email' => 'user@taskgrabber.com',
        ]);

        // Create categories for each admin (10 per admin)
        foreach ($allAdmins as $admin) {
            $categories = Category::factory()
                ->count(10)
                ->active()
                ->create([
                    'admin_id' => $admin->id,
                    'is_premium' => $admin->is_premium,
                ]);

            // Create tasks for each category (random 10-30 tasks per category)
            foreach ($categories as $category) {
                Task::factory()
                    ->count(random_int(10, 30))
                    ->active()
                    ->create([
                        'category_id' => $category->id,
                        'admin_id' => $admin->id,
                    ]);
            }
        }

        $this->command->info('✅ Freelance Task Grabber data seeded successfully!');
        $this->command->info('🚀 Login credentials:');
        $this->command->info('   👑 Superadmin: superadmin@taskgrabber.com / password');
        $this->command->info('   ⭐ Premium Admin: premium@taskgrabber.com / password');
        $this->command->info('   👤 Test User: user@taskgrabber.com / password');
    }
}