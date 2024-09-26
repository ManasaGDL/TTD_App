import React, { useEffect , useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apis from "../api/apis";
import { Toaster, toast } from "sonner";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// Define the validation schema using yup
const schema = yup.object().shape({
    username: yup.string().required("Enter email/username"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().when("isEdit", {
        is: false,
        then: yup.string().required("Password is required"),
    }),
   
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    // phone_number: yup
    // .string()
    // .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    // .required("Phone number is required"),
    phone_number: yup
    .number()
    .typeError("Phone number must be a number")
    .test(
      "len",
      "Phone number must be exactly 10 digits",
      (value) => value && value.toString().length === 10
    )
    .required("Phone number is required"),
    is_mla: yup.string().oneOf(["1", "0"], "Role is required").required("Role is required"),
    constituency: yup.string().required("Enter Constituency"),
    gender: yup.string().required("Select Gender"),
});

const RegistrationForm = () => {
    const location = useLocation();
    const initialData = location.state || {};
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPassword, setshowPassword] = useState(false)
    // Initialize useForm with validation schema
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        // Change 1: Set default values including converting is_mla to '1' or '0'
        defaultValues: { ...initialData, is_mla: initialData.is_mla ? "1" : "0" },
    });
console.log(initialData)
    useEffect(() => {
        if (Object.keys(initialData).length > 0) {
            Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
            // Change 2: Ensuring is_mla is set correctly
            setValue("is_mla", initialData.is_mla ? "1" : "0");
        } else {
            reset({
                username: "",
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                is_mla: "",
                constituency: "",
                gender: "",
            });
        }
    }, [id]);

    // Handle form submission
    const onSubmit = async (data) => {
        console.log(data)
        try {
            if (!id) {
                const response = await apis.addNewUser(data);
                if (response.status === 201) {
                    toast.success("New user added successfully!");
                    reset({
                        username: "",
                        email: "",
                        password: "",
                        first_name: "",
                        last_name: "",
                        phone_number: "",
                        is_mla: "",
                        constituency: "",
                        gender: "",
                    });
                    // navigate('/view-users')
                }
               
            } else {
               
                const res = await apis.updateUser(id, data);
                toast.success("User updated successfully!");
                 navigate('/view-users')
            }
        } catch (e) {
             if (e.response.status === 500) {
                toast.error("Email or Username already exists.");
              }
            else toast.error("Something went wrong!");
        }
    };

    return (
        <>
            <Toaster richColors position="top-center" />
            {Object.keys(initialData).length > 0 ? (
                <div className="w-full text-center my-5 mx-auto text-xl text-gray-700 font-semibold font-mono">
                    Edit Profile: {initialData.first_name + " " + initialData.last_name}
                </div>
            ) : (
                <div className="w-full text-center my-5 mx-auto text-xl font-semibold text-gray-700 font-mono">Add User</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4 grid grid-cols-1 gap-6 sm:grid-cols-2 bg-slate-50 rounded-lg">
                {/* Change 3: Hidden input for conditional validation */}
                <input type="hidden" {...register("isEdit")} value={Object.keys(initialData).length > 0 ? true : false} />

                {/* <div class="relative z-0 w-full mb-6 group">
  <input type="text" id="floating_input" class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
  <label htmlFor="floating_input" class="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6">Floating Label</label>
</div> */}

                <div className="relative z-0 w-full mb-6 group">
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        autoComplete="off"
                        placeholder=" "
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                            errors.email ? "!border-custom-color-danger" : "border-gray-300"
                        } rounded`}
                    />
                    <label
                        htmlFor="email"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Email
                    </label>
                    {errors.email && <p className="text-custom-color-danger text-sm">{errors.email.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input
                        // type="email"
                        id="username"
                        {...register("username")}
                        autoComplete="off"
                        placeholder=" "
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                            errors.username ? "!border-custom-color-danger" : "border-gray-300"
                        } rounded`}
                    />
                    <label
                        htmlFor="username"
                        for="username"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Username
                    </label>
                    {errors.username && <p className="text-custom-color-danger text-sm">{errors.username.message}</p>}
                </div>

                {!id && Object.keys(initialData).length === 0 && (
                    <div className="relative z-0 w-full mb-6 group">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder=" "
                            autoComplete="new-password"
                            {...register("password")}
                            className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                                errors.password ? "!border-custom-color-danger" : "border-gray-300"
                            } rounded`}
                        />
                        <label
                            htmlFor="password"
                            for="password"
                            className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Password
                        </label>
                        <button  type="button" onClick={() => setshowPassword(!showPassword)} className="h-10 absolute inset-y-0 right-0 flex items-center pr-3">
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                        {errors.password && <p className="text-custom-color-danger text-sm">{errors.password.message}</p>}
                    </div>
                )}

                <div className="relative z-0 w-full mb-6 group">
                    <input
                    type="text"
                        id="first_name"
                        placeholder=" "
                        {...register("first_name")}
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                            errors.first_name ? "!border-custom-color-danger" : "border-gray-300"
                        } rounded`}
                    />
                    <label
                        htmlFor="first_name"
                        for="first_name"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        FirstName of MLA/MP
                    </label>
                    {errors.first_name && <p className="text-custom-color-danger text-sm">{errors.first_name.message}</p>}
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input
                        type="text"
                        id="last_name"
                        placeholder=" "
                        {...register("last_name")}
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                            errors.last_name ? "!border-custom-color-danger" : "border-gray-300"
                        } rounded`}
                    />
                    <label
                        htmlFor="last_name"
                        for="last_name"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        LastName of MLA/MP
                    </label>
                    {errors.last_name && <p className="text-custom-color-danger text-sm">{errors.last_name.message}</p>}
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input
                        type="text"
                        id="phone_number"
                        placeholder=" "
                        {...register("phone_number")}
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                            errors.phone_number ? "!border-custom-color-danger" : "border-gray-300"
                        } rounded`}
                    />
                    <label
                        htmlFor="phone_number"
                        for="phone_number"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Phone Number
                    </label>
                    {errors.phone_number && <p className="text-custom-color-danger text-sm">{errors.phone_number.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <div className="flex items-center space-x-4 pt-6 ">
                        <label className="inline-flex items-center">
                            <input type="radio" value="F" {...register("gender")} className="form-radio " />
                            <span className="ml-2 text-gray-500">Female</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" value="M" {...register("gender")} className="form-radio" />
                            <span className="ml-2 text-gray-500">Male</span>
                        </label>
                    </div>
                    {errors.gender && <p className="text-custom-color-danger text-sm">{errors.gender.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input
                        type="test"
                        placeholder=" "
                        id="constituency"
                        {...register("constituency")}
                        autoComplete="off"
                        className={`block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                            errors.constituency ? "!border-custom-color-danger" : "border-gray-300"
                        } rounded`}
                    />
                    <label
                        htmlFor="constituency"
                        for="constituency"
                        className="absolute text-sm  text-gray-500 peer-focus:text-blue-500  bg-slate-50 duration-300 transform -translate-y-6 scale-75 top-4 left-2  z-10 px-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Constituency
                    </label>
                    {errors.constituency && <p className="text-custom-color-danger text-sm">{errors.constituency.message}</p>}
                </div>
                <div className="mb-4">
                    <div className="flex items-center space-x-4 pt-6">
                        <label className="inline-flex items-center">
                            <input type="radio" value="1" {...register("is_mla")} className="form-radio" />
                            <span className="ml-2 text-gray-500">MLA</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" value="0" {...register("is_mla")} className="form-radio" />
                            <span className="ml-2 text-gray-500">MP</span>
                        </label>
                    </div>
                    {errors.is_mla && <p className="text-custom-color-danger text-sm">{errors.is_mla.message}</p>}
                </div>

                <div className="col-span-2 flex justify-center">
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                        {Object.keys(initialData).length > 0 ? "Edit" : "Submit"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default RegistrationForm;