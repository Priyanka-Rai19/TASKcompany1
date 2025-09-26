import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogIn } from 'lucide-react';

////// creating states here//////

const LoginForm = ({ onToggleForm }) => {
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error, clearError } = useAuth();

    ////Here it will handle form submission//////

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            await login({ username: username.trim() });
        } catch (err) {
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your task manager</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !username.trim()}
                        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onToggleForm}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Don't have an account? Create one
                        </button>
                    </div>

                    {
                        /*Here  are some  Demo accounts information that i am using here */
                    }
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm">
                        <p className="font-medium text-gray-700 mb-2">Demo accounts:</p>
                        <div className="space-y-1 text-gray-600">
                            <p>• Divyansh_kamlesh</p>
                            <p>• Devendra_patel</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;