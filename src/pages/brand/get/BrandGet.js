import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Button, Pagination, Grid, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import Select from "react-select";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import qs from "qs";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useQueryParam from "../../../hooks/useQueryParam";
import axiosInstance from "../../../utiles/axiosInstance";

const specialOptions = [
  { label: "Normal", value: "normal" },
  { label: "Friend", value: "friend" },
  { label: "Our Brand", value: "ourBrand" },
  { label: "Enemy", value: "enemy" },
];

const BrandsGet = () => {
  const [pageCount, setPageCount] = useState();
  // const [currentPage, setCurrentPage] = useState(null);
  // const [title, setTitle] = useState();
  const [myQuery, setMyQuery] = useState();
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  const [firstRender, setFirstRender] = useState(false);
  const [publishedFilter, setPublishedFilter] = useState(false);
  const [indexFilter, setIndexFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const { loading, data: brands, setData: setbrands, getData } = useGetData();
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
    getData("/admin/brands?page=" + params + "&" + myQuery);
  };

  useEffect(() => {
    if (!brands) {
      return;
    }
    setPageCount(brands.meta?.lastPage || 0);
  }, [brands]);

  const handleChangePage = (_, page) => {
    setParams(+page);
  };

  // useEffect(() => {
  //   getData("/admin/brands");
  // }, [getData]);

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/brands/", setbrands);

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
        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete Brand"}
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
            <Button variant="contained" component={Link} to="/brands/create">
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Brand
            </Button>
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

          {userRoutes.includes("/brands/delete") && (
            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              component={Link}
              color={"error"}
              to="/brands/trash"
            >
              <DeleteForeverRoundedIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              Trash
            </Button>
          )}
        </div>

        {userRoutes.includes("count-published-noIndex") &&
          !loading &&
          (brands?.meta?.count || brands?.meta?.count === 0) && (
            <p className="mt-4">count : {brands?.meta?.count}</p>
          )}

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Title Seo</th>
                <th scope="col">Reviews Count</th>
                <th scope="col">Products Count</th>
                <th scope="col">Slug</th>
                <th scope="col">old slug</th>
                <th scope="col">published</th>
                <th scope="col">active</th>
                <th scope="col">Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={11} />
              ) : brands?.data?.length > 0 ? (
                brands?.data.map((brand, index) => (
                  <tr key={brand._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{brand.title}</td>
                    <td>{brand.titleSeo}</td>
                    <td>{brand.reviewsCount}</td>
                    <td>{brand.products ? brand.products[0].length : 0}</td>

                    <td>{brand.slug}</td>
                    <td>{brand.oldSlug}</td>
                    <td>
                      {brand.published ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td>
                      {brand.active ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          brand.image?.fileName
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/main/" +
                              brand.image.fileName
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="brand"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <Link className="me-3" to={"/brands/" + brand._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      {/* {brand.oldSlug && (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={
                            "https://www.brandsreviews.com/brand/" +
                            brand.oldSlug
                          }
                          className="me-3"
                        >
                          <RemoveRedEyeIcon />
                        </a>
                      )} */}

                      <a
                        href={
                          process.env.REACT_APP_SITE_BASE_URL +
                          "/brand/" +
                          brand.slug
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="me-3"
                      >
                        <VisibilityIcon className="action-icons" />
                      </a>

                      {userRoutes.includes("/brands/delete") && (
                        <span
                          onClick={() => {
                            openModalHandler(brand._id);
                          }}
                          className="cursor-pointer me-3"
                        >
                          <DeleteForeverTwoToneIcon className="action-icons  color-red-500" />
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
          {brands?.data.length > 0 ? (
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

export default BrandsGet;
