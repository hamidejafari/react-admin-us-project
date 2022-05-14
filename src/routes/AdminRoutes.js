import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useSelector, shallowEqual } from "react-redux";
import { Routes, Route } from "react-router-dom";

import SidebarDesktop from "../components/SidebarDesktop/SidebarDesktop";
import SidebarMobile from "../components/SidebarMobile/SidebarMobile";
import Header from "../components/Header/Header";
import AuthenticatedComponent from "../HOC/AuthenticatedComponent";
import ToastUi from "../components/UI/ToastUi/ToastUi";

import ReviewGet from "../pages/review/get/ReviewGet";
import ReviewCreate from "../pages/review/create/ReviewCreate";

import BlogCategoryGet from "../pages/blogCategory/get/BlogCategoryGet";
import BlogCategoryCreate from "../pages/blogCategory/create/BlogCategoryCreate";
import BlogCategoryEdit from "../pages/blogCategory/edit/BlogCategoryEdit";
import BlogCategoryTrash from "../pages/blogCategory/trash/BlogCategoryTrash";

import BlogGet from "../pages/blog/get/BlogGet";
import BlogCreate from "../pages/blog/create/BlogCreate";
import BlogEdit from "../pages/blog/edit/BlogEdit";
import BlogTrash from "../pages/blog/trash/BlogTrash";

import ProductGet from "../pages/product/get/ProductGet";
import ProductCreate from "../pages/product/create/ProductCreate";
import ProductEdit from "../pages/product/edit/ProductEdit";
import ProductTrash from "../pages/product/trash/ProductTrash";

import BrandSort from "../pages/category/sort/BrandSort";
import ProductSort from "../pages/category/sort/ProductSort";
import CategoryGet from "../pages/category/get/CategoryGet";
import CategoryBestGet from "../pages/category/get/CategoryBestGet";
import CategoryCreate from "../pages/category/create/CategoryCreate";
import CategoryEdit from "../pages/category/edit/CategoryEdit";
import CategoryTrash from "../pages/category/trash/CategoryTrash";

import BrandGet from "../pages/brand/get/BrandGet";
import BrandCreate from "../pages/brand/create/BrandCreate";
import BrandEdit from "../pages/brand/edit/BrandEdit";
import BrandTrash from "../pages/brand/trash/BrandTrash";

import CreateAdmin from "../pages/user/createAdmin/CreateAdmin";
import UpdateAdmin from "../pages/user/updateAdmin/UpdateAdmin";
import GetAdmin from "../pages/user/getAdmin/GetAdmin";

import RoleGet from "../pages/role/get/RoleGet";
import RoleCreate from "../pages/role/create/RoleCreate";
import RoleEdit from "../pages/role/edit/RoleEdit";

import Dashboard from "../pages/Dashboard";
import LogsGet from "../pages/log/get/LogGet";
import Attribute from "../pages/category/attribute/Attribute";

import GetProductVS from "../pages/vs/GetProductVs/GetProductVs";
import CreateProductVS from "../pages/vs/CreateProductVS/CreateProductVS";
import EditVS from "../pages/vs/EditVS/EditVS";
import NotFound from "../pages/NotFound/NotFound";

import CouponGet from "../pages/coupon/get/CouponGet";
import CouponCreate from "../pages/coupon/create/CouponCreate";
import CouponEdit from "../pages/coupon/edit/CouponEdit";
import CouponTrash from "../pages/coupon/trash/CouponTrash";

import CategoryControlGet from "../pages/control/category/get";
import CategoryControlEdit from "../pages/control/category/edit";

import BrandControlGet from "../pages/control/brand/get";
import BrandControlEdit from "../pages/control/brand/edit";

import ProductControlGet from "../pages/control/product/get";
import ProductControlEdit from "../pages/control/product/edit";

import RedirectGet from "../pages/redirect/get/RedirectGet";
import RedirectCreate from "../pages/redirect/create/RedirectCreate";
import RedirectEdit from "../pages/redirect/edit/RedirectEdit";

import SettingEditGet from "../pages/setting/edit";
import CreateBrandVsCategory from "../pages/vs/brand/CreateBrandVsCategory";
import GetBrandVsCategory from "../pages/vs/brand/GetBrandVsCategory";
import BrandVsAttribute from "../pages/vs/brand/BrandVsAttribute";
import CreateBrandVS from "../pages/vs/brand/CreateBrandVS/CreateBrandVS";
import GetBrandVs from "../pages/vs/brand/GetBrandVs/GetBrandVs";

import ContactUsGet from "../pages/contactUs/get/ContactUsGet";
import SearchHistoryGet from "../pages/searchHistory/SearchHistoryGet";
import BannerGet from "../pages/banner/get/BannerGet";
import React from "react";
import BannerCreate from "../pages/banner/create/BannerCreate";
import BannerEdit from "../pages/banner/edit/BannerEdit";
import ProductEditSlug from "../pages/product/editSlug/ProductEditSlug";
import ReviewReply from "../pages/review/reply/ReviewReply";
import BusinessBrandGet from "../pages/businessBrand/get/BusinessBrandGet";
import BusinessBrandEdit from "../pages/businessBrand/edit/BusinessBrandEdit";

const drawerWidth = parseInt(process.env.REACT_APP_DESKTOP_DRAWER_WIDTH);

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: "100%",
    overflowX: "hidden",
    backgroundColor: "#F3F4F5",
    minHeight: "100vh",
    [theme.breakpoints.up("md")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
      padding: theme.spacing(3),
    },
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  marginBottom: 64,
}));

function AdminRoutes() {
  const isDesktopSidebarOpen = useSelector(
    (state) => state.site?.isDesktopSidebarOpen,
    shallowEqual
  );

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <Box sx={{ display: "flex" }}>
      <ToastUi />
      <Header />
      <SidebarDesktop />
      <SidebarMobile />
      <Main open={isDesktopSidebarOpen}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {userRoutes.includes("/best-categories") && (
            <Route path="/best-categories/" element={<CategoryBestGet />} />
          )}
          <Route path="/categories/brand-sort/:_id" element={<BrandSort />} />
          <Route
            path="/categories/product-sort/:_id"
            element={<ProductSort />}
          />

          {userRoutes.includes("/control-brands") && (
            <Route path="/control-brands" element={<BrandControlGet />} />
          )}

          {userRoutes.includes("/control-products") && (
            <Route path="/control-products" element={<ProductControlGet />} />
          )}

          {userRoutes.includes("/control-categories") && (
            <Route
              path="/control-categories"
              element={<CategoryControlGet />}
            />
          )}

          <Route
            path="/control-products/:_id"
            element={<ProductControlEdit />}
          />
          <Route path="/control-brands/:_id" element={<BrandControlEdit />} />
          <Route
            path="/control-categories/:_id"
            element={<CategoryControlEdit />}
          />

          {userRoutes.includes("/redirects") && (
            <Route path="/redirects" element={<RedirectGet />} />
          )}

          <Route path="/redirects/create" element={<RedirectCreate />} />

          <Route path="/redirects/:_id" element={<RedirectEdit />} />

          {userRoutes.includes("/setting") && (
            <Route path="/setting" element={<SettingEditGet />} />
          )}

          {userRoutes.includes("/reviews") && (
            <>
              <Route path="/reviews" element={<ReviewGet />} />
              <Route path="/reviews/:onModel" element={<ReviewGet />} />
            </>
          )}

          {userRoutes.includes("/reviews/create") && (
            <>
              <Route path="/reviews/create" element={<ReviewCreate />} />
              <Route path="/reviews/reply/:_id" element={<ReviewReply />} />
            </>
          )}

          {userRoutes.includes("/search-history") && (
            <Route path="/search-history" element={<SearchHistoryGet />} />
          )}

          {userRoutes.includes("/banners") && (
            <React.Fragment>
              <Route path="/banners" element={<BannerGet />} />
              <Route path="/banners/create" element={<BannerCreate />} />
              <Route path="/banners/:_id" element={<BannerEdit />} />
            </React.Fragment>
          )}

          {userRoutes.includes("/blogs") && (
            <Route path="/blogs" element={<BlogGet />} />
          )}
          {userRoutes.includes("/blogs/create") && (
            <Route path="/blogs/create" element={<BlogCreate />} />
          )}
          {userRoutes.includes("/blogs/:_id") && (
            <Route path="/blogs/:_id" element={<BlogEdit />} />
          )}

          <Route path="/blogs/trash" element={<BlogTrash />} />

          {userRoutes.includes("/blog-categories") && (
            <Route path="/blog-categories" element={<BlogCategoryGet />} />
          )}
          {userRoutes.includes("/blog-categories/create") && (
            <Route
              path="/blog-categories/create"
              element={<BlogCategoryCreate />}
            />
          )}
          {userRoutes.includes("/blog-categories/:_id") && (
            <Route
              path="/blog-categories/:_id"
              element={<BlogCategoryEdit />}
            />
          )}

          <Route
            path="/blog-categories/trash"
            element={<BlogCategoryTrash />}
          />

          {userRoutes.includes("/products") && (
            <Route path="/products" element={<ProductGet />} />
          )}
          {userRoutes.includes("/products/create") && (
            <Route path="/products/create" element={<ProductCreate />} />
          )}
          {userRoutes.includes("/products/:_id") && (
            <Route path="/products/:_id" element={<ProductEdit />} />
          )}
          {userRoutes.includes("/products/slug-edit") && (
            <Route
              path="/products/:_id/slug-edit"
              element={<ProductEditSlug />}
            />
          )}
          {userRoutes.includes("/products/delete") && (
            <Route path="/products/trash" element={<ProductTrash />} />
          )}
          {userRoutes.includes("/categories") && (
            <Route path="/categories" element={<CategoryGet />} />
          )}
          {userRoutes.includes("/categories/create") && (
            <Route path="/categories/create" element={<CategoryCreate />} />
          )}
          {userRoutes.includes("/categories/:_id") && (
            <Route path="/categories/:_id" element={<CategoryEdit />} />
          )}
          {userRoutes.includes("/categories/delete") && (
            <Route path="/categories/trash" element={<CategoryTrash />} />
          )}
          <Route path="/categories/attribute/:_id" element={<Attribute />} />
          {userRoutes.includes("/brands") && (
            <Route path="/brands" element={<BrandGet />} />
          )}
          {userRoutes.includes("/brands/create") && (
            <Route path="/brands/create" element={<BrandCreate />} />
          )}
          {userRoutes.includes("/brands/:_id") && (
            <Route path="/brands/:_id" element={<BrandEdit />} />
          )}
          {userRoutes.includes("/brands/delete") && (
            <Route path="/brands/trash" element={<BrandTrash />} />
          )}
          {userRoutes.includes("/business-brands") && (
            <Route path="/business-brands" element={<BusinessBrandGet />} />
          )}
          {userRoutes.includes("/business-brands/:_id") && (
            <Route path="/business-brands/:_id" element={<BusinessBrandEdit />} />
          )}
          {userRoutes.includes("/users/create-admin") && (
            <Route path="/users/create-admin" element={<CreateAdmin />} />
          )}
          {userRoutes.includes("/users/edit-admin/:_id") && (
            <Route path="/users/edit-admin/:_id" element={<UpdateAdmin />} />
          )}
          {userRoutes.includes("/admins") && (
            <Route path="/admins" element={<GetAdmin />} />
          )}
          {userRoutes.includes("/roles") && (
            <Route path="/roles" element={<RoleGet />} />
          )}
          {userRoutes.includes("/roles/create") && (
            <Route path="/roles/create" element={<RoleCreate />} />
          )}
          {userRoutes.includes("/roles/:_id") && (
            <Route path="/roles/:_id" element={<RoleEdit />} />
          )}
          {userRoutes.includes("/logs") && (
            <Route path="/logs" element={<LogsGet />} />
          )}
          {userRoutes.includes("/coupons") && (
            <Route path="/coupons" element={<CouponGet />} />
          )}
          {userRoutes.includes("/coupons/create") && (
            <Route path="/coupons/create" element={<CouponCreate />} />
          )}
          {userRoutes.includes("/coupons/:_id") && (
            <Route path="/coupons/:_id" element={<CouponEdit />} />
          )}
          <Route path="/coupons/trash" element={<CouponTrash />} />

          {userRoutes.includes("/vs") && (
            <>
              <Route path="/vs/products" element={<GetProductVS />} />
              <Route path="/vs/products/create" element={<CreateProductVS />} />
              <Route
                path="/vs/brand-category/create"
                element={<CreateBrandVsCategory />}
              />
              <Route
                path="/vs/brand-category"
                element={<GetBrandVsCategory />}
              />
              <Route
                path="/vs/brand-category/attribute/:_id"
                element={<BrandVsAttribute />}
              />
              <Route path="/vs/brand" element={<GetBrandVs />} />
              <Route path="/vs/brand/create" element={<CreateBrandVS />} />
              <Route path="/vs/:_id" element={<EditVS />} />
            </>
          )}

          <Route path="/contact-us" element={<ContactUsGet />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Main>
    </Box>
  );
}

export default AuthenticatedComponent(AdminRoutes);
