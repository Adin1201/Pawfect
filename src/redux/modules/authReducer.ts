import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import JwtDecode from 'jwt-decode';
import { UserResponseDto } from '../../api';
import { UserRoleEnum } from '../../api/api';

export type AuthState = Readonly<{
  token: string | null;
  refreshToken: string | null;
  user: UserResponseDto | null;
  userRole: UserRoleEnum | null;
}>;

export const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  userRole: null,
};

/* eslint no-param-reassign: "off" */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authSuccess(state, action: PayloadAction<any>) {
      state.token = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;

      const decoded: any = JwtDecode(state.token || '');
      // @ts-ignore
      state.userRole = UserRoleEnum[decoded.role];
    },
    authFailure() {
      return initialState;
    },
    setCurrentUser(state, action: PayloadAction<UserResponseDto>) {
      state.user = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

const { actions, reducer } = authSlice;
export const { authSuccess, authFailure, setCurrentUser, logout } = actions;
export default reducer;
