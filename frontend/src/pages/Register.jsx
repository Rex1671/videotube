import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Youtube } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const { register: registerForm, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("fullName", data.fullName);
      formData.append("password", data.password);
      if (data.avatar[0]) formData.append("avatar", data.avatar[0]);
      if (data.coverImage && data.coverImage[0]) formData.append("coverImage", data.coverImage[0]);

      await register(formData);
      toast.success("Account created successfully!");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg bg-surface p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <Youtube className="w-12 h-12 text-primary mb-2" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Create your Account</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text" placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg bg-background border border-surfaceHover focus:border-blue-500 focus:outline-none text-white"
                {...registerForm("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <input
                type="text" placeholder="Username"
                className="w-full px-4 py-3 rounded-lg bg-background border border-surfaceHover focus:border-blue-500 focus:outline-none text-white"
                {...registerForm("username", { required: "Username is required" })}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
          </div>
          
          <div>
            <input
              type="email" placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-background border border-surfaceHover focus:border-blue-500 focus:outline-none text-white"
              {...registerForm("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password" placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-surfaceHover focus:border-blue-500 focus:outline-none text-white"
              {...registerForm("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Avatar (Required)</label>
              <input
                type="file" accept="image/*"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surfaceHover file:text-white hover:file:bg-gray-600"
                {...registerForm("avatar", { required: "Avatar is required" })}
              />
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image</label>
              <input
                type="file" accept="image/*"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surfaceHover file:text-white hover:file:bg-gray-600"
                {...registerForm("coverImage")}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-6 transition-colors flex justify-center items-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center align-middle text-sm">
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in instead</Link>
        </div>
      </div>
    </div>
  );
};
export default Register
