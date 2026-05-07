import DashboardLayoutClient from './layout-client';

export const metadata = {
  title: "WCEA Dashboard",
};

export default function Layout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
