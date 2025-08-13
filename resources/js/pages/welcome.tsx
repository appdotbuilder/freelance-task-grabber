import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    [key: string]: unknown;
}

export default function Welcome({ canLogin, canRegister }: Props) {
    return (
        <>
            <Head title="Freelance Task Grabber - Connect. Work. Earn." />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">🎯</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Task Grabber
                                </h1>
                            </div>
                            
                            {canLogin && (
                                <nav className="flex items-center space-x-4">
                                    <Link
                                        href="/login"
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link href="/register">
                                            <Button>Get Started</Button>
                                        </Link>
                                    )}
                                </nav>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            🚀 Freelance Task Grabber
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            The fastest way for freelancers to grab tasks and start earning. 
                            Join thousands of users competing for premium opportunities!
                        </p>
                        
                        {canLogin && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                <Link href="/register">
                                    <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                                        🎯 Start Grabbing Tasks
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className="w-full sm:w-auto text-lg px-8 py-4"
                                    >
                                        👤 Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl mb-4">⚡</div>
                            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                            <p className="text-gray-600">
                                First-come, first-served task grabbing system. React fast to secure the best opportunities.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl mb-4">💰</div>
                            <h3 className="text-xl font-semibold mb-2">Instant Earnings</h3>
                            <p className="text-gray-600">
                                Complete tasks within 10 minutes and get paid. Track your daily, weekly, and total earnings.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl mb-4">🏆</div>
                            <h3 className="text-xl font-semibold mb-2">Badge System</h3>
                            <p className="text-gray-600">
                                Earn Junior, Senior, and God badges based on your successful task completions.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl mb-4">📱</div>
                            <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
                            <p className="text-gray-600">
                                Grab tasks on the go with our fully responsive design. Never miss an opportunity.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                            <p className="text-gray-600">
                                Protected task environment with proof verification system and dispute resolution.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Real-time Stats</h3>
                            <p className="text-gray-600">
                                Monitor your performance with detailed analytics and wallet history tracking.
                            </p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl">
                        <h2 className="text-3xl font-bold text-center mb-8">🎯 How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">1️⃣</span>
                                </div>
                                <h3 className="font-semibold mb-2">Browse Categories</h3>
                                <p className="text-sm text-gray-600">
                                    Explore premium and regular task categories from verified admins.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">2️⃣</span>
                                </div>
                                <h3 className="font-semibold mb-2">Grab a Task</h3>
                                <p className="text-sm text-gray-600">
                                    Click fast to secure tasks before other freelancers do.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">3️⃣</span>
                                </div>
                                <h3 className="font-semibold mb-2">Complete & Submit</h3>
                                <p className="text-sm text-gray-600">
                                    You have 10 minutes to complete the task and upload proof.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">4️⃣</span>
                                </div>
                                <h3 className="font-semibold mb-2">Get Paid</h3>
                                <p className="text-sm text-gray-600">
                                    After verification, earnings are added to your wallet history.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">1000+</div>
                            <div className="text-gray-600">Active Tasks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">500+</div>
                            <div className="text-gray-600">Freelancers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">50+</div>
                            <div className="text-gray-600">Categories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">$50k+</div>
                            <div className="text-gray-600">Paid Out</div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p>&copy; 2024 Freelance Task Grabber. Ready to compete for the best tasks!</p>
                    </div>
                </footer>
            </div>
        </>
    );
}