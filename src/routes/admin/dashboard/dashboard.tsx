import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardResponseDto } from '../../../api/api';
import expiredIcon from '../../../assets/images/admin-dashboard/expired-icon.png';
import petIcon from '../../../assets/images/admin-dashboard/pet-icon.png';
import userIcon from '../../../assets/images/admin-dashboard/user-icon.png';
import verifiedIcon from '../../../assets/images/admin-dashboard/verified-icon.png';
import adminDashboardService from '../../../services/adminDashboardService';
import './dashboard.scss';

const AdminDashboardPage = () => {
  const [data, setData] = useState<{
    stats: DashboardResponseDto | null;
    pending: boolean;
  }>({
    stats: null,
    pending: true,
  });

  useEffect(() => {
    setData({
      stats: null,
      pending: true,
    });

    adminDashboardService.get().then(
      (res) => {
        setData({
          stats: res,
          pending: false,
        });
      },
      () => {
        setData({
          stats: null,
          pending: false,
        });
      }
    );
  }, []);

  return (
    <div className="admin-dashboard-page">
      {data.pending && <div className="spinner" />}

      {!data.pending && (
        <>
          <div className="row">
            <div className="col-md-4">
              <Link to="/admin/users?status=2">
                <div className="stats-box">
                  <div className="stats-box__icon stats-box__icon--verified">
                    <img src={verifiedIcon} alt="" />
                  </div>
                  <div className="stats-box__value">
                    {data.stats?.verifiedUsers}
                  </div>
                  <div className="stats-box__name">Verified Users</div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <Link to="/admin/users?status=1">
                <div className="stats-box">
                  <div className="stats-box__icon stats-box__icon--pending">
                    <img src={userIcon} alt="" />
                  </div>
                  <div className="stats-box__value">
                    {data.stats?.pendingUsers}
                  </div>
                  <div className="stats-box__name">Pending Users</div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <Link to="/admin/users?status=4">
                <div className="stats-box">
                  <div className="stats-box__icon stats-box__icon--expired">
                    <img src={expiredIcon} alt="" />
                  </div>
                  <div className="stats-box__value">
                    {data.stats?.expiredUsers}
                  </div>
                  <div className="stats-box__name">Expired Users</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="row second-row">
            <div className="col-md-4 mt-6 mt-md-0">
              <Link to="/admin/pets?status=2">
                <div className="stats-box">
                  <div className="stats-box__icon stats-box__icon--verified">
                    <img src={petIcon} alt="" />
                  </div>
                  <div className="stats-box__value">
                    {data.stats?.verifiedPets}
                  </div>
                  <div className="stats-box__name">Verified Pets</div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <Link to="/admin/pets?status=1">
                <div className="stats-box">
                  <div className="stats-box__icon stats-box__icon--pending">
                    <img src={petIcon} alt="" />
                  </div>
                  <div className="stats-box__value">
                    {data.stats?.pendingPets}
                  </div>
                  <div className="stats-box__name">Pending Pets</div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <Link to="/admin/pets?status=4">
                <div className="stats-box">
                  <div className="stats-box__icon stats-box__icon--expired">
                    <img src={expiredIcon} alt="" />
                  </div>
                  <div className="stats-box__value">
                    {data.stats?.expiredPets}
                  </div>
                  <div className="stats-box__name">Expired Pets</div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
