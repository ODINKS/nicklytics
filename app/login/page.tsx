"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import useDataStore from "@/store/useDataStore";
import tokenManager from "@/api/tokenManager";
import { useRouter } from "next/navigation";
import InputField from "@/components/global/inputs/InputField";
import Button from "@/components/global/Button";
import Navbar from "@/components/global/Navbar";
import { useBreakpoint } from "@/hooks/UseBreakPoint";

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .max(50, "Password cannot be longer than 50 characters"),
});

type FormData = z.infer<typeof schema>;

const MOCK_USERS = [
  { username: "admin", password: "Admin123.", role: "admin" },
  { username: "editor", password: "Editor123.", role: "editor" },
];

const LoginPage = () => {
  const setUser = useDataStore((state) => state.setUser);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    const user = MOCK_USERS.find(
      (u) => u.username === data.username && u.password === data.password
    );

    if (!user) {
      toast.error("Invalid username or password");
      return;
    }

    setUser({ username: user.username, role: user.role as "admin" | "editor" });
    tokenManager.setUser({
      username: user.username,
      role: user.role as "admin" | "editor",
    });
    toast.success("Logged in successfully");
    router.push("/dashboard");
  };

  const { isXsOnly } = useBreakpoint();

  return (
    <section
      className={twMerge(
        "h-screen w-full flex items-center justify-center bg-blur-lg bg-black/50",
        "dark:bg-gray-900 dark:bg-opacity-90 overflow-y-auto", isXsOnly?"pt-32 pb-6":""
      )}
    >
      <Navbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={twMerge(
          "w-full max-w-sm flex flex-col gap-3 rounded-lg p-8 shadow-lg",
          "bg-white text-black",
          "dark:bg-gray-800 dark:text-gray-200"
        )}
      >
        <h1 className="mb-6 text-center text-3xl font-semibold text-blue-500">
          Welcome Back!
        </h1>

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <InputField
              label="Username"
              type="text"
              placeholder="Enter your username"
              error={errors.username?.message}
              {...field}
              classNames=""
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              visibilityToggle={true}
              {...field}
              classNames=""
            />
          )}
        />

        <Button
          type="submit"
          label="Login"
          buttonType="primary"
          classNames="mt-4 w-full py-3"
          isLoading={isSubmitting}
          isDisabled={!isValid}
        />
      </form>
    </section>
  );
};

export default LoginPage;
