import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Link, useMatch } from "react-router-dom";
import AutoAwesomeMotionTwoToneIcon from "@mui/icons-material/AutoAwesomeMotionTwoTone";
import PatternRoundedIcon from "@mui/icons-material/PatternRounded";
import AssistantIcon from "@mui/icons-material/Assistant";
import CategoryTwoToneIcon from "@mui/icons-material/CategoryTwoTone";
import LocalPoliceTwoToneIcon from "@mui/icons-material/LocalPoliceTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SimpleBar from "simplebar-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import { ButtonBase, Collapse } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CommentIcon from "@mui/icons-material/Comment";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import logo from "../../assets/logonew.png";
import Badge from "@mui/material/Badge";
import { getCountAction } from "../../redux/slices/countSlice";
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "space-between",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
}));

const CustomButton = styled(ButtonBase)(({ theme }) => ({
  width: "100%",
  padding: "0.75rem 1.25rem",
  fontSize: 13,
  justifyContent: "start",
  transition:
    "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  [theme.breakpoints.up("md")]: {
    "&:hover": {
      backgroundColor: "#1b1b28",
      color: "#ffffff",
    },
  },
}));

const SidebarContent = (props) => {
  const [open, setOpen] = useState({});

  // const userRoutes = useSelector(
  //   (state) => state.user?.user?.routes,
  //   shallowEqual
  // );

  /***********                     category                    **************/
  const isCategories = useMatch({ path: "/categories", end: true });
  const isCategoriesEditValue = useMatch({
    path: "/categories/:id",
    end: true,
  });
  let isCategoriesEdit = false;
  if (isCategoriesEditValue && isCategoriesEditValue.params?.id !== "create") {
    isCategoriesEdit = true;
  }
  const isCategoriesCreate = useMatch({
    path: "/categories/create",
    end: true,
  });
  const isCategoriesAttribute = useMatch({
    path: "/categories/attribute/:id",
    end: true,
  });
  const isCategoriesSort = useMatch({
    path: "/categories/product-sort/:id",
    end: true,
  });
  /***********                     category                    **************/
  /*
   *
   *
   *
   */
  /***********                     blogCategory                    **************/
  const isBlogCategories = useMatch({ path: "/blog-categories", end: true });
  const isBlogCategoriesEditValue = useMatch({
    path: "/blog-categories/:id",
    end: true,
  });
  let isBlogCategoriesEdit = false;
  if (
    isBlogCategoriesEditValue &&
    isBlogCategoriesEditValue.params?.id !== "create"
  ) {
    isBlogCategoriesEdit = true;
  }
  const isBlogCategoriesCreate = useMatch({
    path: "/blog-categories/create",
    end: true,
  });
  /***********                     blogCategory                    **************/
  /*
   *
   *
   *
   */
  /***********                     blog                    **************/
  const isBlogs = useMatch({ path: "/blogs", end: true });
  const isBlogsEditValue = useMatch({
    path: "/blogs/:id",
    end: true,
  });
  let isBlogsEdit = false;
  if (isBlogsEditValue && isBlogsEditValue.params?.id !== "create") {
    isBlogsEdit = true;
  }
  const isBlogsCreate = useMatch({
    path: "/blogs/create",
    end: true,
  });
  /***********                     blog                    **************/
  /*
   *
   *
   *
   */
  /***********                     coupon                    **************/
  const isCoupons = useMatch({ path: "/coupons", end: true });
  const isCouponsEditValue = useMatch({
    path: "/coupons/:id",
    end: true,
  });
  let isCouponsEdit = false;
  if (isCouponsEditValue && isCouponsEditValue.params?.id !== "create") {
    isCouponsEdit = true;
  }
  const isCouponsCreate = useMatch({
    path: "/coupons/create",
    end: true,
  });
  /***********                     coupon                    **************/
  /*
   *
   *
   *
   */
  /***********                     brand                    **************/
  const isBrands = useMatch({ path: "/brands", end: true });
  const isBrandsEditValue = useMatch({
    path: "/brands/:id",
    end: true,
  });
  let isBrandsEdit = false;
  if (isBrandsEditValue && isBrandsEditValue.params?.id !== "create") {
    isBrandsEdit = true;
  }
  const isBrandsCreate = useMatch({
    path: "/brands/create",
    end: true,
  });
  /***********                     brand                    **************/
  /*
   *
   *
   *
   */
  /***********                     product                    **************/
  const isProduct = useMatch({ path: "/products", end: true });
  const isProductEditValue = useMatch({
    path: "/products/:id",
    end: true,
  });
  let isProductEdit = false;
  if (isProductEditValue && isProductEditValue.params?.id !== "create") {
    isProductEdit = true;
  }
  const isProductCreate = useMatch({
    path: "/products/create",
    end: true,
  });
  /***********                     product                    **************/
  /*
   *
   *
   *
   */
  /***********                     log                    **************/
  const isLog = useMatch({
    path: "/logs",
    end: true,
  });
  /***********                     log                    **************/
  /*
   *
   *
   *
   */
  /***********                     dashboard                    **************/
  const isDashboard = useMatch({
    path: "/",
    end: true,
  });
  /***********                     dashboard                    **************/
  /*
   *
   *
   *
   */
  /***********                     vs                    **************/
  const isVsProduct = useMatch({
    path: "/vs/products",
    end: true,
  });
  const isVsProductCreate = useMatch({
    path: "/vs/products/create",
    end: true,
  });

  const isVsProductRef = useRef(isVsProduct);
  const isVsProductCreateRef = useRef(isVsProductCreate);
  const isVsBrandCategory = useMatch({
    path: "/vs/brand-category",
    end: true,
  });
  const isVsBrandCategoryCreate = useMatch({
    path: "/vs/brand-category/create",
    end: true,
  });

  const isVsBrandCategoryRef = useRef(isVsBrandCategory);
  const isVsBrandCategoryCreateRef = useRef(isVsBrandCategoryCreate);

  const isVsBrand = useMatch({
    path: "/vs/brand",
    end: true,
  });
  const isVsBrandCreate = useMatch({
    path: "/vs/brand/create",
    end: true,
  });

  const isVsBrandRef = useRef(isVsBrand);
  const isVsBrandCreateRef = useRef(isVsBrandCreate);

  useEffect(() => {
    if (
      isVsProductRef.current ||
      isVsProductCreateRef.current ||
      isVsBrandCategoryRef.current ||
      isVsBrandCategoryCreateRef.current ||
      isVsBrandRef.current ||
      isVsBrandCreateRef.current
    ) {
      setOpen({ vs: true });
    }
  }, []);
  /***********                     vs                    **************/
  /*
   *
   *
   *
   */
  /***********                     user                    **************/
  const isReviews = useMatch({ path: "/reviews", end: true });
  const isReviewsProduct = useMatch({ path: "/reviews/product", end: true });
  const isReviewsBrand = useMatch({ path: "/reviews/brand", end: true });
  const isReviewsBlog = useMatch({ path: "/reviews/blog", end: true });

  useEffect(() => {
    if (isReviews || isReviewsProduct || isReviewsBrand || isReviewsBlog) {
      setOpen({ review: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /***********                     user                    **************/
  /*
   *
   *
   *
   */
  /***********                     review                    **************/
  const isAdmin = useMatch({
    path: "/admins",
    end: true,
  });
  const isCreateAdmin = useMatch({
    path: "/users/create-admin",
    end: true,
  });
  const isEditAdmin = useMatch({
    path: "/users/edit-admin/:id",
    end: true,
  });
  const isRole = useMatch({
    path: "/roles",
    end: true,
  });
  const isEditRoleValue = useMatch({
    path: "/roles/:id",
    end: true,
  });
  let isEditRole = false;
  if (isEditRoleValue && isEditRoleValue.params?.id !== "create") {
    isEditRole = true;
  }
  const isCreateRole = useMatch({
    path: "/roles/create",
    end: true,
  });

  const isAdminRef = useRef(isAdmin);
  const isCreateAdminRef = useRef(isCreateAdmin);
  const isEditAdminRef = useRef(isEditAdmin);
  const isRoleRef = useRef(isRole);
  const isEditRoleRef = useRef(isEditRole);
  const isCreateRoleRef = useRef(isCreateRole);

  const productReviewsCount = useSelector(
    (state) => state.count?.productReviewsCount,
    shallowEqual
  );
  const brandReviewsCount = useSelector(
    (state) => state.count?.brandReviewsCount,
    shallowEqual
  );
  const blogReviewsCount = useSelector(
    (state) => state.count?.blogReviewsCount,
    shallowEqual
  );
  const reviewCounts = useSelector(
    (state) => state.count?.reviewCounts,
    shallowEqual
  );

  const contactsCount = useSelector(
    (state) => state.count?.contactsCount,
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (+reviewCounts?.reviewsCount !== 0 && !reviewCounts?.reviewsCount) {
      dispatch(getCountAction);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      isAdminRef.current ||
      isCreateAdminRef.current ||
      isEditAdminRef.current ||
      isRoleRef.current ||
      isEditRoleRef.current ||
      isCreateRoleRef.current
    ) {
      setOpen({ review: true });
    }
  }, []);
  /***********                     review                    **************/

  // const isCreateAdmin = useMatch({
  //   path: "/users/create-admin",
  //   end: true,
  // });

  // const isCreateAdminBoolean = !!isCreateAdmin;

  // useEffect(() => {
  //   if (isCreateAdminBoolean) {
  //     setOpen({ user: true });
  //   }
  // }, [isCreateAdminBoolean]);

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }}>
        <DrawerHeader
          sx={{ backgroundColor: "#ffffff", borderRight: "1px solid #9899ac" }}
        >
          <img width={80} src={logo} alt="logo" />
          {props.toggleDesktopSidebar && (
            <span
              onClick={props.toggleDesktopSidebar}
              className="cursor-pointer closeIcon"
            >
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
            </span>
          )}
        </DrawerHeader>
        <Divider sx={{ borderColor: "#CCCCCC" }} />
        <ul className={"sidebarList"}>
          <li className={"side_item"}>
            <CustomButton
              component={Link}
              to="/"
              className={`${
                isDashboard ? "sidebar-button-active side_link" : "side_link"
              }`}
            >
              <DashboardIcon className={"icn_sidebar"} />
              Dashboard
            </CustomButton>
          </li>

          {userRoutes.includes("/control-brands") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/control-brands"
                className={`${"side_link"}`}
              >
                <DashboardIcon className={"icn_sidebar"} />
                Brand Control
              </CustomButton>
            </li>
          )}

          {userRoutes.includes("/control-categories") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/control-categories"
                className={`${"side_link"}`}
              >
                <DashboardIcon className={"icn_sidebar"} />
                Category Control
              </CustomButton>
            </li>
          )}

          {userRoutes.includes("/control-products") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/control-products"
                className={`${"side_link"}`}
              >
                <DashboardIcon className={"icn_sidebar"} />
                Product Control
              </CustomButton>
            </li>
          )}

          {userRoutes.includes("/redirects") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/redirects"
                className={`${"side_link"}`}
              >
                <DashboardIcon className={"icn_sidebar"} />
                Redirect
              </CustomButton>
            </li>
          )}

          <li className={"side_item"}>
            <CustomButton
              className={`${
                isCategories ||
                isCategoriesEdit ||
                isCategoriesCreate ||
                isCategoriesAttribute ||
                isCategoriesSort
                  ? "sidebar-button-active side_link"
                  : "side_link"
              }`}
              component={Link}
              to="/categories"
            >
              <CategoryTwoToneIcon className={"icn_sidebar"} />
              Category
            </CustomButton>
          </li>
          <li className={"side_item"}>
            <CustomButton
              className={`${
                isBrands || isBrandsEdit || isBrandsCreate
                  ? "sidebar-button-active side_link"
                  : "side_link"
              }`}
              component={Link}
              to="/brands"
            >
              <LocalPoliceTwoToneIcon className={"icn_sidebar"} />
              Brands
            </CustomButton>
          </li>
          <li className={"side_item"}>
            <CustomButton
              component={Link}
              to="/products"
              className={`${
                isProduct || isProductEdit || isProductCreate
                  ? "sidebar-button-active side_link"
                  : "side_link"
              }`}
            >
              <AutoAwesomeMotionTwoToneIcon className={"icn_sidebar"} />
              Product
            </CustomButton>
          </li>
          <li className={"side_item"}>
            <CustomButton
              onClick={() => {
                setOpen({ vs: !open.vs });
              }}
            >
              <CompareArrowsRoundedIcon className={"icn_sidebar"} />
              VS
              <KeyboardArrowDownIcon className="arrow-down-sidebar" />
            </CustomButton>
            <Collapse in={open.vs} timeout="auto" unmountOnExit>
              {/* <div className={"side_link"}>
                <CustomButton
                  // component={Link}
                  // to="/vs/brands"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  brand
                </CustomButton>
              </div> */}

              <div
                className={
                  isVsProduct || isVsProductCreate
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/vs/products"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  product
                </CustomButton>
              </div>
              <Divider />
              <div
                className={
                  isVsBrandCategory || isVsBrandCategoryCreate
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/vs/brand-category"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  brand category
                </CustomButton>
              </div>
              <Divider />
              <div
                className={
                  isVsBrand || isVsBrandCreate
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/vs/brand"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  brand
                </CustomButton>
              </div>
              <Divider />
            </Collapse>
          </li>
          <li className={"side_item"}>
            <CustomButton
              className={`${
                isBlogCategories ||
                isBlogCategoriesEdit ||
                isBlogCategoriesCreate
                  ? "sidebar-button-active"
                  : "side_link"
              }`}
              component={Link}
              to="/blog-categories"
            >
              <AutoAwesomeIcon className={"icn_sidebar"} />
              Blog Category
            </CustomButton>
          </li>
          <li className={"side_item"}>
            <CustomButton
              className={`${
                isBlogs || isBlogsEdit || isBlogsCreate
                  ? "sidebar-button-active"
                  : "side_link"
              }`}
              component={Link}
              to="/blogs"
            >
              <AssistantIcon className={"icn_sidebar"} />
              Blog
            </CustomButton>
          </li>
          <li className={"side_item"}>
            <CustomButton
              className={`${
                isCoupons || isCouponsEdit || isCouponsCreate
                  ? "sidebar-button-active"
                  : "side_link"
              }`}
              component={Link}
              to="/coupons"
            >
              <CardGiftcardIcon className={"icn_sidebar"} />
              Coupon
            </CustomButton>
          </li>

          <li className={"side_item"}>
            <CustomButton
              onClick={() => {
                setOpen({ review: !open.review });
              }}
            >
              <Badge
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                badgeContent={reviewCounts}
                color="primary"
              >
                <CommentIcon className={"icn_sidebar"} />
              </Badge>
              Review
              <KeyboardArrowDownIcon className="arrow-down-sidebar" />
            </CustomButton>
            <Collapse in={open.review} timeout="auto" unmountOnExit>
              <div
                className={
                  isReviewsProduct
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/reviews/product"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  review product
                  <Badge
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    badgeContent={productReviewsCount}
                    color="primary"
                    sx={{ marginLeft: 2 }}
                  />
                </CustomButton>
              </div>
              <Divider />
              <div
                className={
                  isReviewsBrand
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/reviews/brand"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  review brand
                  <Badge
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    badgeContent={brandReviewsCount}
                    color="primary"
                    sx={{ marginLeft: 2 }}
                  />
                </CustomButton>
              </div>
              <Divider />
              <div
                className={
                  isReviewsBlog
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/reviews/blog"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  review blog
                  <Badge
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    badgeContent={blogReviewsCount}
                    color="primary"
                    sx={{ marginLeft: 2 }}
                  />
                </CustomButton>
              </div>
              <Divider />
            </Collapse>
          </li>
          <li className={"side_item"}>
            <CustomButton
              className={`${isLog ? "sidebar-button-active" : "side_link"}`}
              component={Link}
              to="/logs"
            >
              <PatternRoundedIcon className={"icn_sidebar"} />
              Logs
            </CustomButton>
          </li>
          <li className={"side_item"}>
            <CustomButton
              className={`${isLog ? "sidebar-button-active" : "side_link"}`}
              component={Link}
              to="/search-history"
            >
              <PatternRoundedIcon className={"icn_sidebar"} />
              Search History
            </CustomButton>
          </li>

          {userRoutes.includes("/setting") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/setting"
                className={`${"side_link"}`}
              >
                <DashboardIcon className={"icn_sidebar"} />
                Setting
              </CustomButton>
            </li>
          )}

          {userRoutes.includes("/contact-us") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/contact-us"
                className={`${"side_link"}`}
              >
                <Badge
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  badgeContent={contactsCount}
                  color="primary"
                >
                  <DashboardIcon className={"icn_sidebar"} />
                </Badge>
                Contact us
              </CustomButton>
            </li>
          )}

          {userRoutes.includes("/banners") && (
            <li className={"side_item"}>
              <CustomButton
                component={Link}
                to="/banners"
                className={`${"side_link"}`}
              >
                <ViewCarouselIcon className={"icn_sidebar"} />
                Banner
              </CustomButton>
            </li>
          )}

          <li className={"side_item"}>
            <CustomButton
              onClick={() => {
                setOpen({ user: !open.user });
              }}
            >
              <PeopleAltIcon className={"icn_sidebar"} />
              Users
              <KeyboardArrowDownIcon className="arrow-down-sidebar" />
            </CustomButton>
            <Collapse in={open.user} timeout="auto" unmountOnExit>
              <div
                className={
                  isAdmin || isCreateAdmin || isEditAdmin
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/admins"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  Admins
                </CustomButton>
              </div>
              <Divider />
              <div
                className={
                  isRole || isEditRole || isCreateRole
                    ? "side_link sidebar-button-active"
                    : "side_link"
                }
              >
                <CustomButton
                  component={Link}
                  to="/roles"
                  sx={{ fontSize: "0.875rem", paddingLeft: "2rem" }}
                >
                  <span className="menu-bullet">
                    <span className="bullet bullet-dot"></span>
                  </span>
                  Roles
                </CustomButton>
              </div>
              <Divider />
            </Collapse>
          </li>
        </ul>
        {/* <Divider sx={{ borderColor: "#CCCCCC" }} /> */}
      </SimpleBar>
    </React.Fragment>
  );
};

export default SidebarContent;
