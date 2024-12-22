import React from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from 'react-router-dom';
import { UserResponseDto, UserRoleEnum } from '../../api';
import { AppState } from '../../redux/rootReducer';
import AdminDashboardPage from '../../routes/admin/dashboard/index';
import AdminFaqPage from '../../routes/admin/faq/index';
import AdminFormsPage from '../../routes/admin/forms';
import AdminPetsPage from '../../routes/admin/pets/index';
import AdminSaveFaqPage from '../../routes/admin/saveFaq';
import AdminSaveFormPage from '../../routes/admin/saveForm';
import AdminUsersPage from '../../routes/admin/users/users';
import Auth from '../../routes/auth';
import Dashboard from '../../routes/dashboard';
import Faq from '../../routes/faq';
import LiabilityForm from '../../routes/liabilityForm';
import OrganisationSearchPage from '../../routes/organisation/search';
import OrganisationSearchResultsPage from '../../routes/organisation/search-results/index';
import PetsPage from '../../routes/pets/pets';
import SavePet from '../../routes/savePet/savePet';
import UserProfile from '../../routes/userProfile/userProfile';
import NavigationPrompt from '../NavigationPrompt';
import OrganisationLayout from '../OrganisationLayout';
import PrivateLayout from '../PrivateLayout';

interface PrivateRouteProps extends RouteProps {
  role?: UserRoleEnum;
  pageTitle?: string;
  specificCondition?: (user: UserResponseDto) => boolean;
}

const AppRoutes = () => {
  function PrivateRoute({
    children,
    role,
    specificCondition,
    pageTitle,
    ...rest
  }: PrivateRouteProps) {
    const auth = useSelector((state: AppState) => state.auth);
    const isLoggedIn = !!auth.token;
    const userRole = auth.userRole;

    const validRole = role ? role === userRole : true;
    const passedCondition =
      specificCondition !== undefined
        ? specificCondition(auth.user as UserResponseDto)
        : true;

    return (
      <Route
        {...rest}
        render={({ location }) =>
          isLoggedIn && validRole && passedCondition ? (
            <PrivateLayout pageTitle={pageTitle}>{children}</PrivateLayout>
          ) : (
            <Redirect
              to={{
                pathname: '/auth',
                state: {
                  from: location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function OrganisationRoute({ children, ...rest }: PrivateRouteProps) {
    const auth = useSelector((state: AppState) => state.auth);
    const isLoggedIn = !!auth.token;
    const userRole = auth.userRole;
    const validRole = userRole === UserRoleEnum.Organisation;

    return (
      <Route
        {...rest}
        render={({ location }) =>
          isLoggedIn && validRole ? (
            <OrganisationLayout>{children}</OrganisationLayout>
          ) : (
            <Redirect
              to={{
                pathname: '/auth',
                state: {
                  from: location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function UserRoute(props: PrivateRouteProps) {
    return <PrivateRoute {...props} role={UserRoleEnum.User} />;
  }

  function AdminRoute(props: PrivateRouteProps) {
    return <PrivateRoute {...props} role={UserRoleEnum.SystemAdministrator} />;
  }

  function PublicRoute({ children, ...rest }: RouteProps) {
    const auth = useSelector((state: AppState) => state.auth);
    const isLoggedIn = !!auth.token;
    const userRole = auth.userRole;

    let redirectTo = '/';

    switch (userRole) {
      case UserRoleEnum.User:
        redirectTo = '/';
        break;
      case UserRoleEnum.Organisation:
        redirectTo = '/database/search';
        break;
      case UserRoleEnum.SystemAdministrator:
        redirectTo = '/admin/dashboard';
        break;
      default:
        break;
    }

    return (
      <Route
        {...rest}
        render={({ location }) =>
          !isLoggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: redirectTo,
                state: {
                  from: location,
                },
              }}
            />
          )
        }
      />
    );
  }

  return (
    <BrowserRouter
      getUserConfirmation={(message, callback) =>
        NavigationPrompt(message, callback)
      }
    >
      <Switch>
        <PublicRoute path="/auth" exact>
          <Auth role={UserRoleEnum.User} />
        </PublicRoute>
        <PublicRoute path="/database" exact>
          <Auth role={UserRoleEnum.Organisation} />
        </PublicRoute>
        <PublicRoute path="/admin" exact>
          <Auth role={UserRoleEnum.SystemAdministrator} />
        </PublicRoute>

        <UserRoute path="/" pageTitle="Dashboard" exact>
          <Dashboard />
        </UserRoute>
        <UserRoute path="/user-profile" pageTitle="User profile">
          <UserProfile userRole={UserRoleEnum.User} />
        </UserRoute>
        <UserRoute path="/pets/:id" pageTitle="Pet profile">
          <SavePet userRole={UserRoleEnum.User} />
        </UserRoute>
        <UserRoute path="/faq" pageTitle="FAQ">
          <Faq />
        </UserRoute>
        <UserRoute path="/forms" pageTitle="Forms">
          <LiabilityForm />
        </UserRoute>
        <UserRoute path="/pets" pageTitle="Pets" exact>
          <PetsPage />
        </UserRoute>

        <OrganisationRoute path="/database/search" exact>
          <OrganisationSearchPage />
        </OrganisationRoute>

        <OrganisationRoute path="/database/search/results">
          <OrganisationSearchResultsPage />
        </OrganisationRoute>

        <OrganisationRoute path="/database/user-profile" exact>
          <UserProfile userRole={UserRoleEnum.Organisation} editable={false} />
        </OrganisationRoute>

        <AdminRoute path="/admin/dashboard">
          <AdminDashboardPage />
        </AdminRoute>

        <AdminRoute path="/admin/pets" exact>
          <AdminPetsPage />
        </AdminRoute>

        <AdminRoute path="/admin/pets/:id">
          <SavePet userRole={UserRoleEnum.SystemAdministrator} />
        </AdminRoute>

        <AdminRoute path="/admin/users" exact>
          <AdminUsersPage />
        </AdminRoute>

        <AdminRoute path="/admin/users/:id">
          <UserProfile
            editable={true}
            userRole={UserRoleEnum.SystemAdministrator}
          />
        </AdminRoute>

        <AdminRoute path="/admin/forms" exact>
          <AdminFormsPage />
        </AdminRoute>

        <AdminRoute path="/admin/forms/new" exact>
          <AdminSaveFormPage />
        </AdminRoute>

        <AdminRoute path="/admin/forms/:id">
          <AdminSaveFormPage />
        </AdminRoute>

        <AdminRoute path="/admin/faq" exact>
          <AdminFaqPage />
        </AdminRoute>

        <AdminRoute path="/admin/faq/new" exact>
          <AdminSaveFaqPage />
        </AdminRoute>

        <AdminRoute path="/admin/faq/:id">
          <AdminSaveFaqPage />
        </AdminRoute>

        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoutes;
