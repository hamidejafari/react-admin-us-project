import React from "react";
import Drawer from "@mui/material/Drawer";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SidebarContent from "../SidebarContent/SidebarContent";
import { SITE_TOGGLE_DESKTOP_SIDEBAR } from "../../redux/constants/siteConstant";

const drawerWidth = parseInt(process.env.REACT_APP_DESKTOP_DRAWER_WIDTH);

function SidebarDesktop() {
  const isDesktopSidebarOpen = useSelector(
    (state) => state.site?.isDesktopSidebarOpen,
    shallowEqual
  );
  const dispatch = useDispatch();

  const toggleDesktopSidebar = () => {
    dispatch({ type: SITE_TOGGLE_DESKTOP_SIDEBAR });
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        display: { xs: "none", md: "block" },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      PaperProps={{
        sx: {
          borderLeft: "none",
          borderRight: "none",
          background: "#1e1e2d",
          boxShadow: "0 0 28px 0 rgb(82 63 105 / 5%)",
          color: "#9899ac",
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDesktopSidebarOpen}
    >
      <SidebarContent toggleDesktopSidebar={toggleDesktopSidebar} />
    </Drawer>
  );
}

export default SidebarDesktop;
