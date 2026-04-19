/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Contacts from "./pages/Contacts";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminRouteGuard from "./admin/AdminRouteGuard";
import AdminLeads from "./admin/AdminLeads";
import AdminTours from "./admin/AdminTours";
import AdminHome from "./admin/AdminHome";
import AdminIntegrations from "./admin/AdminIntegrations";
import AdminSetup from "./admin/AdminSetup";
import AdminSiteSettings from "./admin/AdminSiteSettings";

export default function App() {
  const Router = typeof window !== "undefined" && window.location.protocol === "file:"
    ? HashRouter
    : BrowserRouter;

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route element={<AdminRouteGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="leads" element={<AdminLeads />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="site-settings" element={<AdminSiteSettings />} />
            <Route path="integrations" element={<AdminIntegrations />} />
          </Route>
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:id" element={<TourDetail />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </Router>
  );
}
