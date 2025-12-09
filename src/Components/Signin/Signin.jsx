import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { url } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom'



const Signin = () => {
  const navigate = useNavigate()

  const formSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      console.log('onSubmit', values);
      await postSignIn(values);
    },
  });

  const postSignIn = async (loginUser) => {
    console.log("Sign-in Function is calling")
    try {
      console.log('Login User', loginUser);
      const response = await axios.post(
        `${url}/sign-in`,
        loginUser,
        { withCredentials: true } 
      );
    console.log(response.data)
      if (response.status === 200) {
        console.log('Successfully Signed in', response.data);
          navigate('/homepage');
      }
    } catch (e) {
      console.log('Sign in Error. Please check your credentials.', e.response?.data || e.message);
    }
  };

  const loginWithGoogle = () => {
    console.log('Please login with Google');
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
          Sign in
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
          Use your email or continue with Google
        </p>

        {/* Email/password form */}
        <form onSubmit={formik.handleSubmit} style={{ marginBottom: '16px' }}>
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
          </div>

          <div style={{ marginBottom: '16px' }}>
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
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: '6px',
              border: 'none',
              background: '#111827',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            Sign in
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
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signin;
