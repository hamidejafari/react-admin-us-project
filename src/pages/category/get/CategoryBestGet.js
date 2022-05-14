import React, { useEffect, useState } from "react";
import { Button, Pagination, CircularProgress, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import Select from "react-select";
import qs from "qs";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../../utiles/axiosInstance";
const CategoryBestGet = () => {
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();

  const [myQuery, setMyQuery] = useState();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fethcCategotyLoading, setFethcCategotyLoading] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");

  const { loading, data: categories, getData } = useGetData();

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
      getData("/admin/best-categories?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/best-categories?page=" + currentPage);
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

                  <Grid item xs={12} md={12}>
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

        <span
          onClick={() => {
            openSearchModalHandler();
          }}
          className="cursor-pointer me-3"
          style={{ marginLeft: 10 }}
        >
          <Button variant="contained">
            Search
          </Button>
        </span>

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>

                <th scope="col">List 1</th>
                <th scope="col">List 2</th>
                <th scope="col">List 3</th>

                <th scope="col">Parent</th>
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

                    <td>
                      {category?.products?.map((item, indexItem) => (
                        <p>{"#" + (indexItem + 1) + " " + item?._id?.title}</p>
                      ))}
                    </td>

                    <td>
                      {category?.draftProducts[0]?.map((item, indexItem) => (
                        <p>{"#" + (indexItem + 1) + " " + item?._id?.title}</p>
                      ))}
                    </td>

                    <td>
                      {category?.draftProducts[1]?.map((item, indexItem) => (
                        <p>{"#" + (indexItem + 1) + " " + item?._id?.title}</p>
                      ))}
                    </td>

                    <td>{category.parentId?.title || "-"}</td>
                    <td className="white-space-nowrap">
                      <Link to={"/categories/product-sort/" + category._id}>
                        <Button
                          variant="contained"
                          color="info"
                          style={{ marginRight: 10 }}
                        >
                          <FormatListBulletedIcon
                            style={{ fontSize: 18, marginRight: 2 }}
                          />
                          Product Rate
                        </Button>
                      </Link>
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

export default CategoryBestGet;
