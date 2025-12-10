import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProviderNavbar from "components/navbar/ProviderNavbar";
import ProviderSidebar from "components/sidebar/ProviderSidebar";
import Footer from "components/footer/Footer";
import { providerRoutes } from "routes.js";

export default function ProviderLayout(props) {
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
    getActiveRoute(providerRoutes);
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
      if (prop.layout === "/provider") {
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
      <ProviderSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex h-full w-full flex-col bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] flex h-full flex-col transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="flex h-full flex-col">
            <ProviderNavbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Healthcare Provider Portal"}
              brandText={currentRoute}
              {...rest}
            />
            <div className="flex-1 overflow-y-auto p-2 md:pr-2">
              <Routes>
                {getRoutes(providerRoutes)}
                <Route
                  path="/"
                  element={<Navigate to="/provider/dashboard" replace />}
                />
              </Routes>
            </div>
            <div className="shrink-0 p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
