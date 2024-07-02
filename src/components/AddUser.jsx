import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apis from '../api/apis';
import { Toaster,toast } from 'sonner';
// Define the validation schema using yup
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
  is_mla: yup.string().oneOf(['1', '0'], 'Role is required').required('Role is required'),
});

const RegistrationForm = () => {
  // Initialize useForm with validation schema
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async(data) => {
   
    try{
 const response = await apis.addNewUser(data)
 if(response.status === 201)
 toast.success("New user added successfully!")
    }catch(e)
    {
    toast.error("Something went wrong!")
    }
    // You can handle form submission here, e.g., send data to an API
  };

  return (
    <>
    <Toaster richColors position='top-center'/>
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4 grid grid-cols-1 gap-6 sm:grid-cols-2 bg-slate-50 rounded-lg">
    
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="first_name" className="block text-gray-700">First Name</label>
        <input
          type="text"
          id="first_name"
          {...register('first_name')}
          className={`w-full p-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="last_name" className="block text-gray-700">Last Name</label>
        <input
          type="text"
          id="last_name"
          {...register('last_name')}
          className={`w-full p-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone_number" className="block text-gray-700">Phone Number</label>
        <input
          type="text"
          id="phone_number"
          {...register('phone_number')}
          className={`w-full p-2 border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
      </div>

      <div className="mb-4 ">
        {/* <label className="block text-gray-700">Role</label> */}
        <div className="flex items-center space-x-4 pt-6">
          <label className="inline-flex items-center ">
            <input
              type="radio"
              value="1"
              {...register('is_mla')}
              className="form-radio"
            />
            <span className="ml-2 ">MLA</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="0"
              {...register('is_mla')}
              className="form-radio"
            />
            <span className="ml-2">MP</span>
          </label>
        </div>
        {errors.is_mla && <p className="text-red-500 text-sm">{errors.is_mla.message}</p>}
      </div>

      <div className="col-span-2 flex justify-center">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    </form>
    </>
  );
};

export default RegistrationForm;
