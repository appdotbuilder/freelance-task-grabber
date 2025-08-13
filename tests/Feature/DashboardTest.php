<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    // Regular users should be redirected to home page
    if ($user->role === 'user') {
        $this->get('/dashboard')->assertRedirect('/');
    } else {
        $this->get('/dashboard')->assertOk();
    }
});

test('admin users can visit the dashboard directly', function () {
    $this->actingAs($user = User::factory()->admin()->create());

    $this->get('/dashboard')->assertOk();
});
