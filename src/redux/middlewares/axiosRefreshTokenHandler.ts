import axios, { AxiosError } from 'axios';
import JwtDecode, { JwtPayload } from 'jwt-decode';
import moment from 'moment';
import { Store } from 'redux';
import authService from '../../services/authService';
import { logout } from '../modules/authReducer';
import { AppState } from '../rootReducer';

let isRefreshing = false;
let refreshTokenPromise: Promise<any> | null = null;

const axiosRefreshTokenHandler = (store: Store) => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        if (isRefreshing && refreshTokenPromise) {
          return refreshTokenPromise
            .then(() => {
              return axios.request(error.config);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        const state = store.getState() as AppState;

        if (state.auth.refreshToken) {
          if (state.auth.token) {
            const decoded: JwtPayload = JwtDecode(state.auth.token || '');

            const issued = moment.unix((decoded.iat || 0) as number);

            if (moment().diff(issued, 'minutes') > 24 * 60) {
              store.dispatch(logout());
              return Promise.reject(error);
            }
          }

          isRefreshing = true;

          refreshTokenPromise = store.dispatch<any>(
            authService.refreshToken({ refreshToken: state.auth.refreshToken })
          );

          try {
            await refreshTokenPromise;
            const newState = store.getState() as AppState;
            refreshTokenPromise = null;
            isRefreshing = false;

            if (newState.auth.token) {
              return axios.request(error.config);
            }
          } catch (e) {
            store.dispatch(logout());
            // location.assign('/login');
            return Promise.reject(error);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosRefreshTokenHandler;
