import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { url } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  // 1) Validation schema
  const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  // 2) Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('Signup values:', values);
        // Don't send confirmPassword to backend
        const { name, email, password } = values;
        await postSignUpUser({ name, email, password });
        resetForm();
      } finally {
        setSubmitting(false);
      }
    },
  });

  // 3) API call: sign up user and get JWT cookie
  const postSignUpUser = async (newUser) => {
    try {
      console.log('newUser', newUser);
      const res = await axios.post(`${url}/sign-up`, newUser, {
        // withCredentials: true, // HttpOnly cookie
      });
      if (res.status === 201 || res.status === 200) {
        console.log('Successfully signed up!', res.data);
        navigate('/homepage');
      }
    } catch (error) {
      console.log('Sign up Error:', error.response?.data || error.message);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px 28px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: '8px',
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          Sign up
        </h2>
        <p
          style={{
            margin: 0,
            marginBottom: '20px',
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center',
          }}
        >
          Create an account with email or continue with Google
        </p>

        {/* Email/password SIGNUP form */}
        <form onSubmit={formik.handleSubmit} style={{ marginBottom: '16px' }}>
          {/* Name */}
          <div style={{ marginBottom: '12px' }}>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {formik.touched.name && formik.errors.name && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '12px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '12px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {formik.touched.password && formik.errors.password && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="confirmPassword"
              style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formik.errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: '6px',
              border: 'none',
              background: formik.isSubmitting ? '#4b5563' : '#111827',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
              marginBottom: '8px',
            }}
          >
            {formik.isSubmitting ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          style={{
            width: '100%',
            padding: '8px 0',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            background: '#ffffff',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
