import React, { useEffect, useState } from "react";
import { Button, Pagination, CircularProgress, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import Select from "react-select";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import qs from "qs";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useSelector, shallowEqual } from "react-redux";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useQueryParam from "../../../hooks/useQueryParam";
import axiosInstance from "../../../utiles/axiosInstance";

const levels = [
  { label: "Level 1", value: "1" },
  { label: "Level 2", value: "2" },
  { label: "Level 3", value: "3" },
];

const CategoryGet = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [lessThan5Filter, setLessThan5Filter] = useState(false);
  const [publishedFilter, setPublishedFilter] = useState(false);
  const [indexFilter, setIndexFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const [myQuery, setMyQuery] = useState();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState(null);

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const [showHomePage, setShowHomePage] = useState(false);

  const {
    loading,
    data: categories,
    setData: setcategories,
    getData,
  } = useGetData();

  // useEffect(() => {
  //   getData("/admin/categories");
  // }, [getData]);

  const parentCategories = async () => {
    setFethcCategotyLoading(true);
    const { data } = await axiosInstance.get("/admin/category-parents");
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
    parentCategories();
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

    if (myQuery) {
      getData("/admin/categories?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/categories?page=" + currentPage);
    }
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!categories) {
      return;
    }
    setPageCount(categories.meta?.lastPage || 0);
  }, [categories]);

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
  } = useDeleteRow("/admin/categories/", setcategories);

  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const openSearchModalHandler = (id) => {
    setModalSearchOpen(true);
  };
  const handleClose = () => setModalSearchOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let myQuerySearch = {};
    if (selectedLevel) {
      myQuerySearch.level = selectedLevel.value;
    }
    if (slug) {
      myQuerySearch.slug = slug;
    }
    if (title) {
      myQuerySearch.title = title;
    }
    if (lessThan5Filter) {
      myQuerySearch.lessThan5Filter = true;
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
    if (showHomePage) {
      myQuerySearch.showHomePage = true;
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
        <AppModal setOpen={setModalOpen} open={modalOpen}>
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"delete category"}
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
                <Grid container spacing={2}>
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
                        Level
                      </label>
                      <Select
                        id="level"
                        isLoading={false}
                        value={selectedLevel}
                        onChange={(selectedLevel) => {
                          setSelectedLevel(selectedLevel);
                        }}
                        options={levels}
                        isClearable
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="title">
                        Parent Category
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

                  <Grid item xs={12} md={6}>
                    <div className="mb-3 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={lessThan5Filter}
                        onChange={(e) => setLessThan5Filter(e.target.checked)}
                        id="lessThan5Filter"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="lessThan5Filter"
                      >
                        filter less than 5 rating
                      </label>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
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
            <Button
              variant="contained"
              component={Link}
              to="/categories/create"
            >
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Category
            </Button>

            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              component={Link}
              to="/best-categories/"
            >
              Best Category
            </Button>

            <Button
              onClick={() => {
                openSearchModalHandler();
              }}
              className="cursor-pointer me-3"
              style={{ marginLeft: "10px" }}
              variant="contained"
            >
              <ManageSearchIcon style={{ fontSize: 18, marginRight: "5px" }} />
              Search
            </Button>
          </div>

          {userRoutes.includes("/categories/delete") && (
            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              component={Link}
              color={"error"}
              to="/categories/trash"
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
          (categories?.meta?.count || categories?.meta?.count === 0) && (
            <p className="mt-4">count : {categories?.meta?.count}</p>
          )}

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Parent</th>
                <th scope="col">Slug</th>
                <th scope="col">Level</th>
                <th scope="col">published</th>
                <th scope="col">active</th>
                <th scope="col">Icon</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={9} />
              ) : categories?.data?.length > 0 ? (
                categories.data.map((category, index) => (
                  <tr key={category._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{category.title}</td>
                    <td>{category.parentId?.title || "-"}</td>
                    <td>{category.slug}</td>
                    <td>{category.level}</td>
                    <td>
                      {category.published ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td>
                      {category.active ? (
                        <CheckBoxRoundedIcon />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon />
                      )}
                    </td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          category.icon?.fileName
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/main/" +
                              category.icon.fileName
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="category"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <Link className="me-3" to={"/categories/" + category._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      {category.level === 3 ? (
                        <Link
                          className="me-3"
                          to={"/categories/attribute/" + category._id}
                        >
                          <BubbleChartRoundedIcon className="action-icons color-blue-500" />
                        </Link>
                      ) : null}
                      {category.level === 1 || category.level === 2 ? (
                        <Link
                          className="me-3"
                          to={"/categories/brand-sort/" + category._id}
                        >
                          <FormatListBulletedIcon className="action-icons color-orange-500" />
                        </Link>
                      ) : (
                        <Link
                          className="me-3"
                          to={"/categories/product-sort/" + category._id}
                        >
                          <FormatListBulletedIcon className="action-icons color-orange-500" />
                        </Link>
                      )}

                      {userRoutes.includes("/categories/delete") && (
                        <span
                          onClick={() => {
                            openModalHandler(category._id);
                          }}
                          className="cursor-pointer me-3"
                        >
                          <DeleteForeverTwoToneIcon className="action-icons color-red-500" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="9">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>
          {categories?.data.length > 0 ? (
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

export default CategoryGet;
