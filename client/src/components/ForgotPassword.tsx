import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const auth = getAuth();
    const navigate = useNavigate();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setMessage('');
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (err: any) {
            const cleanedMessage = err.message.replace(/^Firebase:\s*/, '').replace(/\s*\(.*\)$/, '');
            setError(cleanedMessage);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-brown-200 p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-brown-800 mb-6 text-center">
                    Forgot Your Password?
                </h2>
                <p className="text-sm text-brown-600 mb-6 text-center">
                    Enter your email and we'll send you a password reset link.
                </p>

                <form onSubmit={handleReset} className="space-y-6">
                    <input
                        type="email"
                        required
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-brown-200 rounded-xl focus:ring-2 focus:ring-brown-200 focus:outline-none"
                    />

                    {message && (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm">{message}</div>
                    )}
                    {error && (
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-xl text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-brown-700 text-white font-semibold py-3 rounded-xl transition-all hover:bg-brown-800 disabled:opacity-50"
                    >
                        {sending ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm">
                    <a href="/login" className="text-brown-600 hover:text-brown-800">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
