// import { Footer } from "@/components/shared/Footer";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAppContext } from "@/context/AppContext";
// import { authApi } from "@/service/apiService";
// import { AlertCircle, Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import bgFlag3 from "../../../public/images/flag3.webp";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { refreshUserData } = useAppContext();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(
//     location.state?.message || null
//   );
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       // 1. Use the authApi service for API login and token
//       const response = await authApi.login({
//         email,
//         password,
//       });

//       if (!response.success) {
//         throw new Error(response.error || "Login failed");
//       }

//       // 2. After successful login, refresh user data from context
//       const userData = await refreshUserData();

//       if (!userData) {
//         throw new Error("Failed to load user profile");
//       }

//       toast.success("Login successful!");

//       // Handle redirection based on status
//       if (userData?.status === "approved") {
//         navigate("/dashboard");
//       } else if (userData.status === "pending") {
//         navigate("/verification-pending");
//       } else if (userData.status === "rejected") {
//         navigate("/verification-rejected");
//       } else {
//         const redirectPath = location.state?.from || "/dashboard";
//         navigate(redirectPath);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError(
//         error instanceof Error
//           ? error.message
//           : "An error occurred during login."
//       );
//       toast.error("Login failed. Please check your credentials.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//               <div
//   className="relative min-h-[80vh] bg-fixed bg-center bg-cover"
//   style={{
//     backgroundImage:
//       `url(${bgFlag3})`,
//   }}
// >
//   {/* Blur & Dark Overlay */}
//   <div className="absolute inset-0 bg-gray-900/60"></div>
//       <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-lg py-12">
//           <div className="relative flex">
//             <Card className="shadow-lg z-10 w-full">
//               <CardHeader className="space-y-1">
//                 <CardTitle className="text-2xl text-center">
//                   Log in to your account
//                 </CardTitle>
//               </CardHeader>
//               <form onSubmit={handleSubmit}>
//                 <CardContent className="grid gap-4">
//                   {error && (
//                     <Alert variant="destructive">
//                       <AlertCircle className="h-4 w-4" />
//                       <AlertDescription>{error}</AlertDescription>
//                     </Alert>
//                   )}
//                   <div className="grid gap-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="ngo@example.org"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     {/* <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                     <Link
//                       to="/forgot-password"
//                       className="text-sm text-brand-purple hover:underline"
//                     >
//                       Forgot password?
//                     </Link>
//                   </div> */}
//                     <Label htmlFor="password">Password</Label>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                       <button
//                         type="button"
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         onClick={togglePasswordVisibility}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4 text-gray-500" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-gray-500" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex flex-col space-y-4">
//                   <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Logging in..." : "Log in"}
//                   </Button>
//                   <div className="text-center text-sm">
//                     Don't have an account?{" "}
//                     <Link
//                       to="/signup"
//                       className="text-brand-purple hover:underline"
//                     >
//                       Sign up
//                     </Link>
//                   </div>
//                 </CardFooter>
//               </form>
//             </Card>
//             <img
//               src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/6670372063dc58df744db688_bg-5.png"
//               loading="lazy"
//               width="258"
//               height="228"
//               alt=""
//               className="bg-5"
//             />
//             <img
//               src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66703674a5a268dcdbfaccbb_bg-4.png"
//               loading="lazy"
//               width="206"
//               height="304"
//               alt=""
//               className="bg-4"
//             />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Login;




import { Footer } from "@/components/shared/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { authApi } from "@/service/apiService";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bgFlag3 from "../../../public/images/flag3.webp";
import bgFlag4 from "../../../public/images/flag7.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserData } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(location.state?.message || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((s) => !s);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await authApi.login({ email, password });
      if (!response.success) throw new Error(response.error || "Login failed");

      const userData = await refreshUserData();
      if (!userData) throw new Error("Failed to load user profile");

      toast.success("Login successful!");

      if (userData?.status === "approved") navigate("/dashboard");
      else if (userData.status === "pending") navigate("/verification-pending");
      else if (userData.status === "rejected") navigate("/verification-rejected");
      else navigate(location.state?.from || "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during login.");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

return (
  <div
    className="relative min-h-[87vh] bg-fixed bg-center bg-cover"
    style={{ backgroundImage: `url(${bgFlag3})` }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/60 z-0" />

    {/* Centered Panel */}
    <div className="relative z-10 min-h-[87vh] flex items-center justify-center px-4">
      <div
        className="
          grid w-full max-w-[1300px] md:h-[470px]
          grid-cols-1 md:grid-cols-2
          shadow-2xl overflow-hidden
          bg-white/0
        "
      >
        {/* Left: Form (white) */}
        <div className="bg-white flex items-center justify-center px-6 py-10 md:px-12">
          <div className="w-full max-w-xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email" >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ngo@example.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                  // className="mt-2 h-12 rounded-xl border border-gray-300 px-4 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#b80c0c]"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    // className="h-12 rounded-xl border border-gray-300 px-4 pr-10 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#b80c0c]"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                // className="w-full h-12 rounded-xl bg-[#b80c0c] hover:bg-[#a60b0b] text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Sign In"}
              </Button>

              <div className="flex items-center justify-between text-sm text-gray-700">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-[#074C2D]"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="hover:underline">
                  Forgot Password
                </Link>
              </div>

              {/* Optional: bottom-left logo like screenshot */}
              {/* <img src="/logo.png" alt="Brand" className="h-10 mt-6" /> */}
            </form>
          </div>
        </div>

        {/* Right: Welcome (red) */}
        <div
        className="relative bg-center bg-cover text-white flex items-center justify-center p-10 md:p-16 text-center"
    style={{ backgroundImage: `url(${bgFlag4})` }}>
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div className="max-w-md relative">
            <h2 className="text-4xl font-extrabold">Welcome to Login</h2>
            <p className="mt-6 text-lg text-white">Don’t have an account?</p>
            <Link
              to="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-md border border-white/80 px-6 py-2 font-medium hover:bg-white/10"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Footer above overlay */}
    <div className="relative z-10">
      <Footer />
    </div>
  </div>
);
};

export default Login;
