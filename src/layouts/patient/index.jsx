import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PatientNavbar from "components/navbar/PatientNavbar";
import PatientSidebar from "components/sidebar/PatientSidebar";
import Footer from "components/footer/Footer";
import { patientRoutes } from "routes.js";

export default function PatientLayout(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(patientRoutes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/patient") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="flex h-full w-full">
      <PatientSidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="h-full">
            <PatientNavbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Healthcare Access Connector"}
              brandText={currentRoute}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(patientRoutes)}
                <Route
                  path="/"
                  element={<Navigate to="/patient/dashboard" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
