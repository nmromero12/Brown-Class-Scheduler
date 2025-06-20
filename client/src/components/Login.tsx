import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');

        signInWithEmailAndPassword(auth, email, password)
        .then(response => {
            console.log(response.user.uid);
            navigate('/');
        })
        .catch((error) => {
            console.log(error);
            setError(error.message);
            setAuthing(false);
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-800 rounded-full mb-4">
                        <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <h1 className="text-3xl font-bold text-red-900 mb-2">
                        Welcome to Brown Class Scheduler
                    </h1>
                    <p className="text-red-700">
                        Login or Sign up to get Started
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
                    <form onSubmit={(e) => { e.preventDefault(); signInWithEmail(); }} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-red-900 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="your_name@brown.edu"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-red-900 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={authing}
                            className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {authing ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In with Email'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-2">
                        <a href="#" className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                            Forgot your password?
                        </a>
                        <div className="text-sm text-red-600">
                            Don't have an account? {' '}
                            <a href="#" className="font-semibold hover:text-red-800 transition-colors">
                                Sign up here
                            </a>
                        </div>
                    </div>
                </div>

                {/* University Notice */}
                <div className="mt-6 text-center text-xs text-red-600">
                    <p>Intended for Brown University students</p>
                    <p className="mt-1">Use your Brown credentials to access the class scheduler</p>
                </div>
            </div>
        </div>
    );
};

export default Login;