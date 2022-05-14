import React from "react";
import Toolbar from "@mui/material/Toolbar";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { USER_DETAILS_RESET } from "../../redux/constants/userConstant";

import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  SITE_TOGGLE_DESKTOP_SIDEBAR,
  SITE_TOGGLE_MOBILE_SIDEBAR,
} from "../../redux/constants/siteConstant";
import Cookies from "js-cookie";

const drawerWidth = parseInt(process.env.REACT_APP_DESKTOP_DRAWER_WIDTH);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  color: "#000",
  backgroundColor: "#ffffff",
  [theme.breakpoints.up("md")]: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const Header = () => {
  const name = useSelector((state) => state.user?.user?.name, shallowEqual);
  const family = useSelector((state) => state.user?.user?.family, shallowEqual);

  const isDesktopSidebarOpen = useSelector(
    (state) => state.site?.isDesktopSidebarOpen,
    shallowEqual
  );
  const isMobileSidebarOpen = useSelector(
    (state) => state.site?.isMobileSidebarOpen,
    shallowEqual
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDesktopSidebar = () => {
    dispatch({ type: SITE_TOGGLE_DESKTOP_SIDEBAR });
  };

  const toggleMobileSidebar = () => {
    dispatch({
      type: SITE_TOGGLE_MOBILE_SIDEBAR,
      payload: { isMobileSidebarOpen: !isMobileSidebarOpen },
    });
  };

  const logoutHandler = () => {
    Cookies.remove("admin-token", { domain: process.env.REACT_APP_COOKIE_URL });

    dispatch({
      type: USER_DETAILS_RESET,
    });

    navigate(`/login`);
  };

  return (
    <AppBar className={"AppBar"} position="fixed" open={isDesktopSidebarOpen}>
      <Toolbar variant="string" className={"headerToolbar"}>
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" } }}
          style={{ ...(isDesktopSidebarOpen && { display: "none" }) }}
          onClick={toggleDesktopSidebar}
          className="cursor-pointer openIcon rotate-180"
        >
          {/* desktop */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              opacity="0.5"
              d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
              fill="black"
            ></path>
            <path
              d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
              fill="black"
            ></path>
          </svg>
        </Box>
        <Box
          component="span"
          sx={{ display: { xs: "block", md: "none" } }}
          style={{ ...(isMobileSidebarOpen && { display: "none" }) }}
          onClick={toggleMobileSidebar}
          className="cursor-pointer openIcon rotate-180"
        >
          {/* mobile */}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              opacity="0.5"
              d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
              fill="black"
            ></path>
            <path
              d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
              fill="black"
            ></path>
          </svg>
        </Box>
        <div className="d-flex justify-content-space-between w-100 align-items-center">
          <div className={"headerToolbar__heading"}>
            <Box
              component={Link}
              to={"/"}
              className={"text-a-2"}
              style={{ fontWeight: "bolder" }}
              sx={{ display: { xs: "none", md: "inline" } }}
            >
              Admin Panel
            </Box>
          </div>
          <div className={"headerToolbar__logout"}>
            <div className="me-3">
              <span className="welcome-span">welcome, </span>
              <span className="admin-name-span">{name + " " + family}</span>
            </div>
            <div className="logout cursor-pointer">
              <PowerSettingsNewIcon
                onClick={logoutHandler}
                sx={{ fontSize: "1.8rem" }}
              />
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
