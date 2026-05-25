import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAppData } from "../context/AppContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const {setUser,setIsAuth}=useAppData()

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/login`, {
        code: authResult["code"],
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user)
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-sm space-y-6 w-full">
        <h1 className="text-center text-3xl font-bold text-[#e23774]">
          Zomato
        </h1>
        <p className="text-center text-sm text-gray-500">
          Log in and Sign up to continue
        </p>
        <button
          onClick={googleLogin}
          disabled={loading}
          className="flex  cursor-pointer w-full items-center justify-center gap-3 rounded-xl border
         border-gray-300 bg-white px-4 py-3"
        >
          <FcGoogle size={20} />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">
          By proceeding, you agree to Zomato's{" "}
          <span className="text-[#e23774] cursor-pointer">Terms of Use</span> and{" "}
          <span className="text-[#e23774] cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
