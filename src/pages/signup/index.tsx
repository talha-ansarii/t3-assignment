import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";

const Signup: NextPage = () => {
  const router = useRouter();

  // TRPC mutation for handling signup
  const { mutate: signup, isLoading, isError, error } = trpc.useMutation(["creatUser.signup"], {
    onSuccess: () => {
      alert("Signed up!");
      router.push("/api/auth/signin");
    },
  });

  // Define the signup form data type
  type Signup = {
    email: string;
    password: string;
    name: string;
  };

  // Setup form handling with react-hook-form
  const { register, handleSubmit } = useForm<Signup>();

  const onSubmitSignup = handleSubmit((data) => signup(data));

  return (
    <div className="w-full h-screen bg-black/80 flex flex-col justify-center items-center">
      <h1 className="text-white text-3xl font-bold mb-16">Sign Up to create your account!</h1>
      <div className="bg-black/90 p-10 shadow-lg rounded-md">
        <form onSubmit={onSubmitSignup} className="flex flex-col gap-4">
          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-white" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="rounded-md border-2 px-1"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-white" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="rounded-md border-2 px-1"
              placeholder="Enter your email"
              {...register("email")}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label className="text-white" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="rounded-md border-2 px-1"
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>

          {/* Submit Button */}
          <input
            className="bg-gray-500 font-bold rounded-md shadow-md hover:bg-gray-200 transition-all duration-300 hover:text-black hover:border-black text-white px-3 py-3 mt-2 cursor-pointer"
            type="submit"
            value={isLoading ? "Signing up..." : "Sign Up"}
            disabled={isLoading}
          />

          {/* Error Message */}
          {isError && <p className="text-red-500 text-sm mt-2">{error?.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
