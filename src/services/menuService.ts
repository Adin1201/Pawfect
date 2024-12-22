import { UserRoleEnum } from '../api/api';
import faqIcon from '../assets/images/menu-icons/faq.png';
import liabilityIcon from '../assets/images/menu-icons/liability.png';
import petIcon from '../assets/images/menu-icons/pet.png';
import profileIcon from '../assets/images/menu-icons/profile.png';
import summaryIcon from '../assets/images/menu-icons/summary.png';

interface MenuItem {
  to: string;
  image: any;
  title: string;
  exact?: boolean;
}

const userMenu: MenuItem[] = [
  {
    to: '/',
    image: summaryIcon,
    title: 'Summary',
    exact: true,
  },
  {
    to: '/user-profile',
    image: profileIcon,
    title: 'User Profile',
  },
  {
    to: '/pets',
    image: petIcon,
    title: 'Pets',
  },
  //   {
  //     to: '/menu',
  //     image: menuIcon,
  //     title: 'Menu',
  //   },
  //   {
  //     to: '/settings',
  //     image: settingsIcon,
  //     title: 'Settings',
  //   },
  {
    to: '/forms',
    image: liabilityIcon,
    title: 'Forms',
  },
];

const adminMenu: MenuItem[] = [
  {
    to: '/admin/dashboard',
    image: summaryIcon,
    title: 'Dashboard',
  },
  {
    to: '/admin/pets',
    image: petIcon,
    title: 'Pets',
  },
  {
    to: '/admin/users',
    image: profileIcon,
    title: 'Users',
  },
  {
    to: '/admin/forms',
    image: liabilityIcon,
    title: 'Forms',
  },
  {
    to: '/admin/faq',
    image: faqIcon,
    title: 'FAQ',
  },
];

const getMenuForRole = (role: UserRoleEnum) => {
  switch (role) {
    case UserRoleEnum.User:
      return userMenu;
    case UserRoleEnum.SystemAdministrator:
      return adminMenu;
    default:
      return [];
  }
};

export default { getMenuForRole };
