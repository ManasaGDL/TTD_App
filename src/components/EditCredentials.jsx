import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toaster, toast } from "sonner";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import apis from "../api/apis";
// Define the validation schema using yup
const schema = yup.object().shape({
  new_password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("new_password"), null], "Passwords must match"),
});

const EditCredentials = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const location = useLocation();
  const initialData = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();
  const state = location.state || {};
  const hasState = Object.keys(state).length > 0;

  // Initialize useForm with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: {
    //   username: ,
    // },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (id) {
        const res = await apis.resetPassword(data, id);
        toast.success("Password successfully updated!. Please Login again");
        reset({ new_password: "", confirm_password: "" });
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      {hasState ? (
        <div className="max-w-2xl mx-auto mb-4 p-4  rounded-lg bg-slate-50">
          <h2 className="text-xl font-semibold mb-2 text-green-700 ">
            Profile Information
          </h2>
          <div className="space-y-2">
            <div className="flex ">
              <span className="font-mono font-semibold mr-3">Username:</span>
              <span>{state.username}</span>
            </div>
            <div className="flex ">
              <span className="font-mono font-semibold mr-3">Email:</span>
              <span>{state.email}</span>
            </div>
            <div className="flex ">
              <span className="font-mono font-semibold mr-3">Constituency:</span>
              <span>{state.constituency}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mb-4 p-4  rounded-lg ">
          <h2 className="text-xl font-mono font-semibold mb-2">Profile Information</h2>
          <div className="space-y-2">
            <div className="flex ">
              <span className="font-mono font-semibold mr-3">Username:</span>
              <span>{localStorage.getItem("username")}</span>
            </div>
            <div className="flex ">
              <span className="font-mono font-semibold mr-3">Email:</span>
              <span>{localStorage.getItem("email")}</span>
            </div>
            <div className="flex ">
              <span className="font-mono font-semibold mr-3">Constituency:</span>
              <span>{localStorage.getItem("constituency")}</span>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-4 bg-slate-50 rounded-lg text-center"
      >
        <h2 className="text-center text-lg font-mono font-semibold mb-7">Change Password</h2>

        <div className="mb-4 relative flex flex-col items-center">
          <label
            htmlFor="new_password"
            className="block justify-start items-start text-gray-700 pr-4 font-mono"
          >
            New Password
          </label>
          <div className="relative w-1/2">
            <input
              type={passwordVisible ? "text" : "password"}
              id="new_password"
              autoComplete="new-password"
              {...register("new_password")}
              className={`w-full p-2 pr-10 border ${
                errors.new_password ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-red-500 text-sm">
              {errors.new_password.message}
            </p>
          )}
          <div className="text-sm text-gray-600 mt-2">
            {/* Password strength indicators */}
          </div>
        </div>

        <div className="mb-4 relative flex flex-col items-center">
          <label
            htmlFor="confirm_password"
            className="block justify-start text-gray-700 pr-4 font-mono"
          >
            Confirm Password
          </label>
          <div className="relative w-1/2">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirm_password"
              autoComplete="confirm_password"
              {...register("confirm_password")}
              className={`w-full p-2 pr-10 border ${
                errors.confirm_password ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {confirmPasswordVisible ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:ring-lime-300 rounded-lg h-12 w-full max-w-xs text-white font-mono transition-colors duration-300 ease-in-out"
          >
            Change Password
          </button>
        </div>

        <div className="text-mono text-xs mt-4">
          <ul>
            <li>
              <span className="font-bold">Note:</span> Password must be a
              minimum of 8 characters (including at least one capital letter,
              one special character, one number, and one lowercase letter).
            </li>
          </ul>
        </div>
      </form>
    </>
  );
};

export default EditCredentials;
