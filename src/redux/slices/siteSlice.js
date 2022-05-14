import {
  SITE_TOGGLE_DESKTOP_SIDEBAR,
  SITE_TOGGLE_MOBILE_SIDEBAR,
} from "../constants/siteConstant";

const initialState = {
  isDesktopSidebarOpen: true,
  isMobileSidebarOpen: false,
  successSnackBar: false,
  snackbarOpen: false,
  snackbarMessage: "",
  snackbarSeverity: "success",
};

export default function siteReducer(state = initialState, action) {
  switch (action.type) {
    case SITE_TOGGLE_DESKTOP_SIDEBAR: {
      return { ...state, isDesktopSidebarOpen: !state.isDesktopSidebarOpen };
    }
    case SITE_TOGGLE_MOBILE_SIDEBAR: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}
