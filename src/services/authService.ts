import { toast } from 'react-toastify';
import { ThunkDispatch } from 'redux-thunk';
import {
  AuthApi,
  AuthApiApiV1AuthEmailVerificationVerifyPostRequest,
  AuthApiApiV1AuthForgotPasswordRequestPostRequest,
  AuthApiApiV1AuthForgotPasswordResetPasswordPostRequest,
  AuthApiApiV1AuthForgotPasswordVerifyCodePostRequest,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterUserRequestDto,
} from '../api/api';
import { authSuccess } from '../redux/modules/authReducer';
import { defaultErrorHandler } from '../utils/error-handler';
import usersService from './usersService';

// @ts-ignore
const authApi = new AuthApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const login = (loginRequestDto: LoginRequestDto) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const response = await authApi.apiV1AuthLoginPost({
        loginRequestDto,
      });

      dispatch(authSuccess(response.data));
      dispatch(usersService.getMe());

      toast.success('Login successful');

      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

const register = (registerUserRequestDto: RegisterUserRequestDto) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const response = await authApi.apiV1AuthRegisterPost({
        registerUserRequestDto,
      });

      dispatch(authSuccess(response.data));
      toast.success('Registration successful');

      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

const refreshToken = (refreshTokenRequestDto: RefreshTokenRequestDto) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      toast.dismiss();
      const response = await authApi.apiV1AuthRefreshTokenPost({
        refreshTokenRequestDto,
      });

      dispatch(authSuccess(response.data));
      dispatch(usersService.getMe());

      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error.response?.data);
    }
  };
};

const forgotPasswordRequest = (
  data: AuthApiApiV1AuthForgotPasswordRequestPostRequest
) => {
  return async () => {
    try {
      const response = await authApi.apiV1AuthForgotPasswordRequestPost(data);
      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

const forgotPasswordVerifyCode = (
  data: AuthApiApiV1AuthForgotPasswordVerifyCodePostRequest
) => {
  return async () => {
    try {
      const response = await authApi.apiV1AuthForgotPasswordVerifyCodePost(
        data
      );
      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

const forgotPasswordResetPassword = (
  data: AuthApiApiV1AuthForgotPasswordResetPasswordPostRequest
) => {
  return async () => {
    try {
      const response = await authApi.apiV1AuthForgotPasswordResetPasswordPost(
        data
      );
      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

const verifyEmailCode = async (
  data: AuthApiApiV1AuthEmailVerificationVerifyPostRequest
) => {
  try {
    const response = await authApi.apiV1AuthEmailVerificationVerifyPost(data);
    return Promise.resolve(response.data);
  } catch (error) {
    defaultErrorHandler(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export default {
  login,
  register,
  refreshToken,
  forgotPasswordRequest,
  forgotPasswordVerifyCode,
  forgotPasswordResetPassword,
  verifyEmailCode,
};
