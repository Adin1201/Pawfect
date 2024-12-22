import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/images/logo-color.png';
import { logout } from '../../redux/modules/authReducer';
import Button from '../Button';
import './OrganisationLayout.scss';

interface Props {
  children: React.ReactNode;
}

export default function OrganisationLayout(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutUser = () => {
    dispatch(logout());
    history.push('/database');
  };

  return (
    <div className={'organisation-layout'}>
      <div className="top-bar">
        <div className="container">
          <div className="logo">
            <Link to="/database/search">
              <img src={logo} alt="Pawfect logo" className="logo" />
            </Link>
          </div>

          <div className="actions">
            <Button
              title="Log out"
              onClick={() => logoutUser()}
              size="small"
              color="primary"
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">{props.children}</div>
      </div>
    </div>
  );
}
