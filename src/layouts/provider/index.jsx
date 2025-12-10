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
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="h-full">
            <ProviderNavbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Healthcare Provider Portal"}
              brandText={currentRoute}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(providerRoutes)}
                <Route
                  path="/"
                  element={<Navigate to="/provider/dashboard" replace />}
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
