import React from "react";
import Drawer from "@mui/material/Drawer";

import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { Box } from "@mui/system";
import SidebarContent from "../SidebarContent/SidebarContent";
import { SITE_TOGGLE_MOBILE_SIDEBAR } from "../../redux/constants/siteConstant";

const drawerWidth = parseInt(process.env.REACT_APP_MOBILE_DRAWER_WIDTH);

function SidebarMobile() {
  const isMobileSidebarOpen = useSelector(
    (state) => state.site?.isMobileSidebarOpen,
    shallowEqual
  );
  const dispatch = useDispatch();

  const toggleMobileSidebar = (status) => {
    dispatch({
      type: SITE_TOGGLE_MOBILE_SIDEBAR,
      payload: { isMobileSidebarOpen: status },
    });
  };

  return (
    <Drawer
      sx={{ display: { xs: "block", md: "none" }, zIndex: 5000 }}
      anchor={"left"}
      open={isMobileSidebarOpen}
      onClose={() => toggleMobileSidebar(false)}
      onOpen={() => toggleMobileSidebar(true)}
      PaperProps={{
        sx: {
          borderLeft: "none",
          borderRight: "none",
          background: "#1e1e2d",
          boxShadow: "0 0 28px 0 rgb(82 63 105 / 5%)",
          color: "#9899ac",
        },
      }}
    >
      <Box sx={{ width: drawerWidth }} role="presentation">
        <SidebarContent />
      </Box>
    </Drawer>
  );
}

export default SidebarMobile;
