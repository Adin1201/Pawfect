import React, { useState } from 'react';
import { UserRoleEnum } from '../../api/api';
import logoWhite from '../../assets/images/logo-white.png';
import './auth.scss';
import LoginPage from './login/login';
import RegisterPage from './register/register';
import ResetPassword from './resetPassword/resetPassword';

interface Props {
  role: UserRoleEnum;
}

export enum AuthPage {
  Login,
  Register,
  ResetPassword,
}

interface State {
  currentPage: AuthPage;
}

export default function Auth(props: Props) {
  const [state, setState] = useState<State>({
    currentPage: AuthPage.Login,
  });

  const toggleCurrentPage = (page: AuthPage) => {
    setState({
      currentPage: page,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card-wrapper shadow-card">
        <div className="auth-card">
          <div className="logo-wrapper">
            <img src={logoWhite} className="logo-img" alt="Pawfect logo" />
            {props.role === UserRoleEnum.Organisation && (
              <h3 className="auth-title">Database</h3>
            )}
            {props.role === UserRoleEnum.SystemAdministrator && (
              <h3 className="auth-title">Admin Dashboard</h3>
            )}
          </div>

          <div className="content-wrapper">
            {state.currentPage === AuthPage.Login && (
              <LoginPage
                toggleAuthPage={(page) => toggleCurrentPage(page)}
                role={props.role}
              />
            )}
            {props.role === UserRoleEnum.User &&
              state.currentPage === AuthPage.Register && (
                <RegisterPage
                  toggleAuthPage={(page) => toggleCurrentPage(page)}
                />
              )}
            {state.currentPage === AuthPage.ResetPassword && (
              <ResetPassword
                toggleAuthPage={(page) => toggleCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
