import { Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { UsersApi, UsersApiApiV1UsersMePutRequest } from '../api/api';
import { setCurrentUser } from '../redux/modules/authReducer';
import { defaultErrorHandler } from '../utils/error-handler';

// @ts-ignore
const usersApi = new UsersApi({
  basePath: process.env.REACT_APP_API_BASE_URL,
});

const getMe = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await usersApi.apiV1UsersMeGet();
      dispatch(setCurrentUser(response.data));
      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

const put = (data: UsersApiApiV1UsersMePutRequest) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const response = await usersApi.apiV1UsersMePut(data);
      toast.success('Profile updated successfully');
      dispatch(getMe());
      return Promise.resolve(response.data);
    } catch (error) {
      defaultErrorHandler(error.response?.data);
      return Promise.reject(error.response?.data);
    }
  };
};

export default {
  getMe,
  put,
};
