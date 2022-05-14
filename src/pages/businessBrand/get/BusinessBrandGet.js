import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Select from "react-select";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qs from "qs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import axiosInstance from "../../../utiles/axiosInstance";

const specialOptions = [
  { label: "Normal", value: "normal" },
  { label: "Friend", value: "friend" },
  { label: "Our Brand", value: "ourBrand" },
  { label: "Enemy", value: "enemy" },
];

const BusinessBrandGet = () => {
  const [pageCount, setPageCount] = useState();
  // const [currentPage, setCurrentPage] = useState(null);
  // const [title, setTitle] = useState();
  const [myQuery, setMyQuery] = useState();
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  const [firstRender, setFirstRender] = useState(false);
  const [publishedFilter, setPublishedFilter] = useState(false);
  const [indexFilter, setIndexFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const { loading, data: businessBrands, getData } = useGetData();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [params, setParams] = useQueryParam("page");
  const [title, setTitle] = useQueryParam("title");
  const [slug, setSlug] = useQueryParam("slug");
  const [showHomePage, setShowHomePage] = useQueryParam("showHomePage");

  const categories = async () => {
    setFethcCategotyLoading(true);
    const { data } = await axiosInstance.get("/admin/category-level-two");
    setFethcCategotyLoading(false);
    const opt = [];
    for (const e of data) {
      opt.push({
        label: e.title,
        value: e._id,
      });
    }
    setCategoryOptions(opt);
  };

  useEffect(() => {
    categories();
  }, []);

  useEffect(() => {
    if (firstRender) {
      startFerch();
    } else {
      setFirstRender(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, myQuery]);

  useEffect(() => {
    if (!params) {
      setParams(1);
    }
    let myQuerySearch = {};
    if (selectedSpecial) {
      myQuerySearch.special = selectedSpecial.value;
    }
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
    if (showHomePage) {
      myQuerySearch.showHomePage = true;
    }
    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFerch = () => {
    getData("/admin/business-brands?page=" + params + "&" + myQuery);
  };

  useEffect(() => {
    if (!businessBrands) {
      return;
    }
    setPageCount(businessBrands.meta?.lastPage || 0);
  }, [businessBrands]);

  const handleChangePage = (_, page) => {
    setParams(+page);
  };

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (selectedSpecial) {
      myQuerySearch.special = selectedSpecial.value;
    }
    if (slug) {
      myQuerySearch.slug = slug;
    }
    if (title) {
      myQuerySearch.title = title;
    }
    if (showHomePage) {
      myQuerySearch.showHomePage = showHomePage;
    }
    if (publishedFilter) {
      myQuerySearch.publishedFilter = publishedFilter;
    }
    if (indexFilter) {
      myQuerySearch.indexFilter = indexFilter;
    }
    if (activeFilter) {
      myQuerySearch.activeFilter = activeFilter;
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
    myQuerySearch = qs.stringify(myQuerySearch);
    setMyQuery(myQuerySearch);
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
                        Special
                      </label>
                      <Select
                        id="level"
                        isLoading={false}
                        value={selectedSpecial}
                        onChange={(selectedSpecial) => {
                          setSelectedSpecial(selectedSpecial);
                        }}
                        options={specialOptions}
                        isClearable
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
                        isLoading={fethcCategotyLoading}
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
                  <Grid item xs={12}>
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

        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <span
              onClick={() => {
                openSearchModalHandler();
              }}
              className="cursor-pointer me-3"
              style={{ marginLeft: 10 }}
            >
              <Button variant="contained">
                <ManageSearchIcon
                  style={{ fontSize: 18, marginRight: "5px" }}
                />
                Search
              </Button>
            </span>
          </div>
        </div>

        {userRoutes.includes("count-published-noIndex") &&
          !loading &&
          (businessBrands?.meta?.count ||
            businessBrands?.meta?.count === 0) && (
            <p className="mt-4">count : {businessBrands?.meta?.count}</p>
          )}

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">published</th>
                <th scope="col">active</th>
                <th scope="col">Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={6} />
              ) : businessBrands?.data?.length > 0 ? (
                businessBrands?.data.map((businessBrand, index) => (
                  <tr key={businessBrand._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{businessBrand.title}</td>
                    <td>
                      {businessBrand.brandId.published ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td>
                      {businessBrand.brandId.active ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          businessBrand.image
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/main/" +
                              businessBrand.image
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="businessBrand"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <Link
                        className="me-3"
                        to={"/business-brands/" + businessBrand._id}
                      >
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <a
                        href={
                          process.env.REACT_APP_SITE_BASE_URL +
                          "/businessBrand/" +
                          businessBrand.brandId?.slug
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="me-3"
                      >
                        <VisibilityIcon className="action-icons" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="6">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>
          {businessBrands?.data.length > 0 ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                page={+params || 0}
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

export default BusinessBrandGet;
