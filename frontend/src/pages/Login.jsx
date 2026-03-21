import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Youtube } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Successfully logged in!");
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <Youtube className="w-12 h-12 text-primary mb-2" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to VideoTube</h2>
          <p className="text-gray-400 mt-2">to continue to VideoTube</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email or Username"
              className="w-full px-4 py-3 rounded-lg bg-background border border-surfaceHover focus:border-blue-500 focus:outline-none text-white transition-colors"
              {...register("email", { required: "Email or username is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-surfaceHover focus:border-blue-500 focus:outline-none text-white transition-colors"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Next"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Not your computer? Use Guest mode to sign in privately.
          <br />
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create account</Link>
        </div>
      </div>
    </div>
  );
};
export default Login
