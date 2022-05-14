import React, { useEffect, useState } from "react";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import qs from "qs";
import Select from "react-select";
import { useSelector, shallowEqual } from "react-redux";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import LinkTwoToneIcon from "@mui/icons-material/LinkTwoTone";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useQueryParam from "../../../hooks/useQueryParam";
import axiosInstance from "../../../utiles/axiosInstance";

const ProductGet = () => {
  const {
    loading,
    data: products,
    setData: setproducts,
    getData,
  } = useGetData();

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();
  const [myQuery, setMyQuery] = useState();
  const [showHomePage, setShowHomePage] = useState(false);
  const [publishedFilter, setPublishedFilter] = useState(false);
  const [indexFilter, setIndexFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const [fetchParentLoading, setFetchParentLoading] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);

  const parents = async () => {
    setFetchParentLoading(true);
    const { data } = await axiosInstance.get("/admin/product-parents");
    setFetchParentLoading(false);
    const opt = [];
    for (const e of data.categories) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }
    setCategoryOptions(opt);
    const opt2 = [];
    for (const e of data.brands) {
      opt2.push({
        label: e.title,
        value: e._id,
      });
    }
    setBrandOptions(opt2);
  };

  useEffect(() => {
    parents();
  }, []);

  useEffect(() => {
    if (!params) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(+params);
  }, [params]);

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    getData("/admin/products?page=" + currentPage + "&" + myQuery);
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!products) {
      return;
    }
    setPageCount(products.meta?.lastPage || 0);
  }, [products]);

  const handleChangePage = (_, page) => {
    if (currentPage && +page === currentPage) {
      return;
    }

    setParams(+page);
  };

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/products/", setproducts);

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (slug) {
      myQuerySearch.slug = slug;
    }
    if (title) {
      myQuerySearch.title = title;
    }

    if (selectedCategory) {
      let categoryIds = "";
      selectedCategory.forEach((cat, index) => {
        if (index !== 0) {
          categoryIds = categoryIds + "," + cat.value;
        } else {
          categoryIds = categoryIds + cat.value;
        }
      });
      myQuerySearch.categoryIds = categoryIds;
    }
    if (selectedBrand) {
      let brandIds = "";
      selectedBrand.forEach((cat, index) => {
        if (index !== 0) {
          brandIds = brandIds + "," + cat.value;
        } else {
          brandIds = brandIds + cat.value;
        }
      });
      myQuerySearch.brandIds = brandIds;
    }

    if (publishedFilter) {
      myQuerySearch.publishedFilter = publishedFilter;
    }
    if (indexFilter) {
      myQuerySearch.indexFilter = indexFilter;
    }
    if (showHomePage) {
      myQuerySearch.showHomePage = true;
    }
    if (activeFilter) {
      myQuerySearch.activeFilter = activeFilter;
    }
    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    setCurrentPage(1);
    setParams(1);
    setModalSearchOpen(false);
  };

  const userRoutes = useSelector(
    (state) => state.user?.user?.routes,
    shallowEqual
  );

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <Button variant="contained" component={Link} to="/products/create">
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Product
            </Button>

            <Button
              variant="contained"
              style={{ marginLeft: 10 }}
              onClick={() => {
                openSearchModalHandler();
              }}
            >
              <ManageSearchIcon style={{ fontSize: 18, marginRight: "5px" }} />
              Search
            </Button>
          </div>

          {userRoutes.includes("/products/delete") && (
            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              component={Link}
              color={"error"}
              to="/products/trash"
            >
              <DeleteForeverRoundedIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              Trash
            </Button>
          )}
        </div>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"delete product"}
            deleteHandler={() => {
              deleteHandler();
            }}
            content={"Are You Sure?"}
          />
        </AppModal>

        <AppModal setOpen={setModalSearchOpen} open={modalSearchOpen}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Search</h5>
              <CloseRoundedIcon
                className="cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Name
                      </label>
                      <input
                        className="form-input"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value, "")}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="slug">
                        Slug
                      </label>
                      <input
                        className="form-input"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value, "")}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Category
                      </label>
                      <Select
                        id="category"
                        isLoading={fetchParentLoading}
                        value={selectedCategory}
                        onChange={(selectedCategory) => {
                          setSelectedCategory(selectedCategory);
                        }}
                        options={categoryOptions}
                        isClearable
                        isMulti
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Brand
                      </label>
                      <Select
                        id="brand"
                        isLoading={fetchParentLoading}
                        value={selectedBrand}
                        onChange={(selectedBrand) => {
                          setSelectedBrand(selectedBrand);
                        }}
                        options={brandOptions}
                        isClearable
                        isMulti
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="mb-3 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={showHomePage}
                        onChange={(e) => setShowHomePage(e.target.checked)}
                        id="showHomePage"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showHomePage"
                      >
                        Show Home Page
                      </label>
                    </div>
                  </Grid>

                  {userRoutes.includes("count-published-noIndex") && (
                    <>
                      {" "}
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label
                            className="form-check-label"
                            htmlFor="publishedFilter"
                          >
                            published :
                          </label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => {
                              setPublishedFilter(e.target.value);
                            }}
                          >
                            <option></option>
                            <option value="true">published true</option>
                            <option value="false">published false</option>
                          </select>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3 ">
                          <label
                            className="form-check-label"
                            htmlFor="indexFilter"
                          >
                            no index :
                          </label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => {
                              setIndexFilter(e.target.value);
                            }}
                          >
                            <option></option>
                            <option value="true">no index true</option>
                            <option value="false">no index false</option>
                          </select>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className="mb-3 ">
                          <label
                            className="form-check-label"
                            htmlFor="activeFilter"
                          >
                            active :
                          </label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => {
                              setActiveFilter(e.target.value);
                            }}
                          >
                            <option></option>
                            <option value="true">active true</option>
                            <option value="false">active false</option>
                          </select>
                        </div>
                      </Grid>
                    </>
                  )}

                  <Grid className="mb-3" item xs={12}>
                    <div className="d-flex">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                      >
                        Search
                      </Button>
                      {loading ? (
                        <CircularProgress className="me-3" color="inherit" />
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
              </form>
            </div>
            <div className="modal-footer"></div>
          </div>
        </AppModal>

        {userRoutes.includes("count-published-noIndex") &&
          !loading &&
          (products?.meta?.count || products?.meta?.count === 0) && (
            <p className="mt-4">count : {products?.meta?.count}</p>
          )}

        <div className="scroll-x mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className={"text-center"}>
                  #
                </th>
                <th scope="col" className={"text-center"}>
                  Name
                </th>
                <th scope="col" className={"text-center"}>
                  Title Seo
                </th>
                <th scope="col" className={"text-center"}>
                  Reviews Count
                </th>
                <th scope="col" className={"text-center"}>
                  Category
                </th>
                <th scope="col" className={"text-center"}>
                  Brand
                </th>
                <th scope="col" className={"text-center"}>
                  Published
                </th>
                <th scope="col" className={"text-center"}>
                  Active
                </th>
                <th scope="col" className={"text-center"}>
                  Image
                </th>
                <th scope="col" className={"text-center"}>
                  Star
                </th>

                <th scope="col" className={"text-center"}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={11} />
              ) : products?.data?.length > 0 ? (
                products?.data.map((product, index) => (
                  <tr
                    style={
                      !product.descriptionShort ||
                      product.descriptionShort === "" ||
                      product.descriptionShort === "<p>new</p>"
                        ? { backgroundColor: "green" }
                        : {}
                    }
                    key={product._id}
                  >
                    <th scope="row" className={"text-center"}>
                      {index + 1}
                    </th>
                    <td className={"text-center"}>{product.title}</td>
                    <td className={"text-center"}>{product.titleSeo}</td>
                    <td className={"text-center"}>{product.reviewsCount}</td>

                    <td className={"text-center"}>
                      {product.categoryId?.title}
                    </td>
                    <td className={"text-center"}>{product.brandId?.title}</td>
                    <td className={"text-center"}>
                      {product.published ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td className={"text-center"}>
                      {product.active ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>

                    <td>
                      <img
                        className="table-img"
                        src={
                          product.images.length > 0
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/main/" +
                              product.images[0].fileName
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="product"
                      />
                    </td>

                    <td className={"text-center"}>{product.star}</td>
                    {/* <td className={"text-center"}>{product.siteUrl}</td> */}
                    {/* <td className={"text-center"}>{product.clickSiteCount}</td> */}
                    <td className={"text-center white-space-nowrap"}>
                      <Link className="me-3" to={"/products/" + product._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      {userRoutes.includes("/products/slug-edit") && (
                        <Link
                          className="me-3"
                          to={"/products/" + product._id + "/slug-edit"}
                        >
                          <LinkTwoToneIcon className="action-icons" />
                        </Link>
                      )}

                      <a
                        href={
                          process.env.REACT_APP_SITE_BASE_URL +
                          "/" +
                          product.slug
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="me-3"
                      >
                        <VisibilityIcon className="action-icons" />
                      </a>

                      {userRoutes.includes("/products/delete") && (
                        <span
                          onClick={() => {
                            openModalHandler(product._id);
                          }}
                          className="cursor-pointer me-3"
                        >
                          <DeleteForeverTwoToneIcon className="action-icons color-red-500 " />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="11">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>

          {products?.data.length > 0 ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                page={currentPage || 0}
                onChange={handleChangePage}
                count={pageCount || 0}
                color="primary"
              />
            </div>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductGet;
