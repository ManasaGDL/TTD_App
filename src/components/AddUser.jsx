import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apis from '../api/apis';
import { Toaster, toast } from 'sonner';
import { useLocation, useParams ,useNavigate } from 'react-router-dom';

// Define the validation schema using yup
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().when('isEdit', {
    is: false,
    then: yup.string().required('Password is required'),
  }),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone_number: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
  is_mla: yup.string().oneOf(['1', '0'], 'Role is required').required('Role is required'),
constituency: yup.string().required("Enter Constituency"),
gender:yup.string().required("Select Gender")
});

const RegistrationForm = () => {
  const location = useLocation();
  const initialData = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate()
  // Initialize useForm with validation schema
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    // Change 1: Set default values including converting is_mla to '1' or '0'
    defaultValues: { ...initialData, is_mla: initialData.is_mla ? '1' : '0' },
  });

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      Object.keys(initialData).forEach(key => setValue(key, initialData[key]));
      // Change 2: Ensuring is_mla is set correctly
      setValue('is_mla', initialData.is_mla ? '1' : '0');
    } else {
      reset({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        is_mla: '',
        constituency:'',
        gender:''
      });
    }
  }, [id]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
    
      if(!id)
        {const response = await apis.addNewUser(data);
      if (response.status === 201) {
        toast.success("New user added successfully!");
        reset({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone_number: '',
          is_mla: '',
           constituency:'',
        gender:''
        });
        // navigate('/view-users')
      } 
      // else if (response.status === 200) {
      //   toast.success("User updated successfully!");
      // }
    
    }
    else{
     const res = await apis.updateUser(id,data);
     toast.success("User updated successfully!");
    //  navigate('/view-users')
    }
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong!");
    }
  };

  
  return (
    <>
      <Toaster richColors position='top-center' />
      {Object.keys(initialData).length > 0 && <div className="max-w-2xl mx-auto text-lg font-mono">Edit Profile: {initialData.first_name + " " + initialData.last_name}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4 grid grid-cols-1 gap-6 sm:grid-cols-2 bg-slate-50 rounded-lg">
        
        {/* Change 3: Hidden input for conditional validation */}
        <input type="hidden" {...register('isEdit')} value={Object.keys(initialData).length > 0} />

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            autoComplete='off'
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {Object.keys(initialData).length === 0 && <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            autoComplete='new-password'
            {...register('password')}
            className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>}

        <div className="mb-4">
          <label htmlFor="first_name" className="block text-gray-700">FirstName of MLA/MP</label>
          <input
            type="text"
            id="first_name"
            {...register('first_name')}
            className={`w-full p-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="last_name" className="block text-gray-700">LastName of MLA/MP</label>
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
        <div className="mb-4">
     
          <div className="flex items-center space-x-4 pt-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="F"
                {...register('gender')}
                className="form-radio"
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="M"
                {...register('gender')}
                className="form-radio"
              />
              <span className="ml-2">Male</span>
            </label>
          </div>
          {errors.gender&& <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="constituency" className="block text-gray-700">Constituency</label>
          <input
            type="test"
            id="constituency"
            {...register('constituency')}
            autoComplete='off'
            className={`w-full p-2 border ${errors.constituency? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          {errors.constituency && <p className="text-red-500 text-sm">{errors.constituency.message}</p>}
        </div>
        <div className="mb-4">
          <div className="flex items-center space-x-4 pt-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="1"
                {...register('is_mla')}
                className="form-radio"
              />
              <span className="ml-2">MLA</span>
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
            {Object.keys(initialData).length > 0 ? 'Edit' : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;
