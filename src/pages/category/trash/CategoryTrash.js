import React, { useEffect, useState } from "react";
import { Button, Pagination, CircularProgress, Grid } from "@mui/material";
import Select from "react-select";
import qs from "qs";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../../utiles/axiosInstance";
import useRestoreRow from "../../../hooks/useRestoreRow";
import RestoreModal from "../../../components/UI/RestoreModal/RestoreModal";

const levels = [
  { label: "Level 1", value: "1" },
  { label: "Level 2", value: "2" },
  { label: "Level 3", value: "3" },
];

const CategoryTrash = () => {
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();

  const [myQuery, setMyQuery] = useState();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState(null);

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");

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
      getData("/admin/categories/trash?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/categories/trash?page=" + currentPage);
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
    setCurrentPage(1);
    setParams(1);

    setModalSearchOpen(false);
  };

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useRestoreRow("/admin/categories/restore/", setcategories);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal setOpen={setModalOpen} open={modalOpen}>
          <RestoreModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"restore category"}
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
              style={{ marginLeft: "10px" }}
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

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Parent</th>
                <th scope="col">Slug</th>
                <th scope="col">Level</th>
                <th scope="col">Icon</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={7} />
              ) : categories?.data?.length > 0 ? (
                categories.data.map((category, index) => (
                  <tr key={category._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{category.title}</td>
                    <td>{category.parentId?.title || "-"}</td>
                    <td>{category.slug}</td>
                    <td>{category.level}</td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          category.icon
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/" +
                              category.icon
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="category"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <span
                        onClick={() => {
                          openModalHandler(category._id);
                        }}
                        className="cursor-pointer me-3"
                      >
                        <RestorePageRoundedIcon className="action-icons" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="7">
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

export default CategoryTrash;
