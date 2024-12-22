import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { UserRoleEnum, UserStatusEnum } from '../../api';
import chatImg from '../../assets/images/chat.png';
import closeIcon from '../../assets/images/close-icon.png';
import defaultAvatar from '../../assets/images/default-avatar.png';
import faq from '../../assets/images/faq.png';
import hamburgerMenuImg from '../../assets/images/hamburger-menu.png';
import logo from '../../assets/images/logo-color.png';
import logoutImg from '../../assets/images/logout.png';
import userVerifiedBadge from '../../assets/images/user-verified-badge.png';
import { logout } from '../../redux/modules/authReducer';
import { AppState } from '../../redux/rootReducer';
import menuService from '../../services/menuService';
import Dropdown from '../Dropdown';
import './PrivateLayout.scss';

interface Props {
  children: React.ReactNode;
  pageTitle?: string;
}

interface State {
  mobileMenuOpened: boolean;
}

export default function PrivateLayout(props: Props) {
  const [state, setState] = useState<State>({
    mobileMenuOpened: false,
  });

  const { children } = props;
  const dispatch = useDispatch();
  const userRole = useSelector((state: AppState) => state.auth.userRole);
  const user = useSelector((state: AppState) => state.auth.user);

  return (
    <div className={'private-layout'}>
      <div
        className={
          !state.mobileMenuOpened ? 'menu-wrapper' : 'menu-wrapper is-open'
        }
      >
        {state.mobileMenuOpened && (
          <button
            type="button"
            onClick={() => setState({ mobileMenuOpened: false })}
            className="close-menu-button"
          >
            <img src={closeIcon} alt="Close icon" className="close-icon" />
          </button>
        )}
        <Link to="/">
          <div className="logo-wrapper">
            <img src={logo} alt="Pawfect logo" className="logo" />
          </div>
        </Link>
        <div className="avatar-container">
          <div
            className="user-avatar-img"
            style={{
              backgroundImage: `url(${user?.profileImage ?? defaultAvatar})`,
            }}
          />

          {user?.status === UserStatusEnum.Verified && (
            <img
              src={userVerifiedBadge}
              alt="User verified badge"
              className="user-verified-img"
            />
          )}
        </div>

        <div className="user-info-wrapper">
          <span className="user-info-text">{user?.name}</span>
          <span className="user-info-text-id">
            ID: {user?.externalId?.toUpperCase()}
          </span>
        </div>
        <div className="border-separator" />

        <ul>
          {userRole &&
            menuService.getMenuForRole(userRole).map((x) => (
              <li key={x.to}>
                <NavLink
                  to={x.to}
                  activeClassName="selected"
                  className="list-item"
                  exact={x.exact}
                >
                  <div className="item-icon-wrapper">
                    <img src={x.image} alt={x.title} className="item-img" />
                  </div>
                  {x.title}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>

      <div className="content-wrapper">
        <div className="topbar">
          <div className="page-title">
            <span>{props.pageTitle}</span>
          </div>

          <div
            onClick={() => setState({ mobileMenuOpened: true })}
            role="presentation"
          >
            <img
              src={hamburgerMenuImg}
              alt="Logout"
              className="hamburger-menu-img"
            />
          </div>
          <div className="user-options-wrapper">
            {userRole === UserRoleEnum.User && (
              <>
                <Link className="header-right-button" to="/faq">
                  <img src={faq} style={{ height: 40 }} alt="Faq" />
                </Link>
                <a
                  href="mailto:support@pawfect.com"
                  className="header-right-button"
                  title="FAQ"
                >
                  <img src={chatImg} style={{ height: 40 }} alt="Faq" />
                </a>
              </>
            )}
            <Dropdown
              triggerComponent={
                <img src={logoutImg} alt="Logout" className="logout-img" />
              }
              dropdownComponent={() => (
                <div className="dropdown-wrapper">
                  <Link
                    to="/auth"
                    onClick={() => {
                      dispatch(logout());
                    }}
                    className="logout-link"
                  >
                    Log out
                  </Link>
                </div>
              )}
            />
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
