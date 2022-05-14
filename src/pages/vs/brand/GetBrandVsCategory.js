import React, { useEffect, useState } from "react";
import { Button, Pagination, CircularProgress, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import qs from "qs";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useSelector, shallowEqual } from "react-redux";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const GetBrandVsCategory = () => {
  const [title, setTitle] = useState();
  const [slug, setSlug] = useState();

  const [myQuery, setMyQuery] = useState();

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");

  const { loading, data: categories, getData } = useGetData();

  // useEffect(() => {
  //   getData("/admin/categories");
  // }, [getData]);

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
      getData(
        "/admin/brandComparisonCategories?page=" + currentPage + "&" + myQuery
      );
    } else {
      getData("/admin/brandComparisonCategories?page=" + currentPage);
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
            <Button
              variant="contained"
              component={Link}
              to="/vs/brand-category/create"
            >
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Category
            </Button>
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

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={4} />
              ) : categories?.data?.length > 0 ? (
                categories.data.map((category, index) => (
                  <tr key={category._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{category.title}</td>
                    <td>{category.slug}</td>
                    <td className="white-space-nowrap">
                      <Link
                        className="me-3"
                        to={"/vs/brand-category/" + category._id}
                      >
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <Link
                        className="me-3"
                        to={"/vs/brand-category/attribute/" + category._id}
                      >
                        <BubbleChartRoundedIcon className="action-icons color-blue-500" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th className="text-center" colSpan="4">
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

export default GetBrandVsCategory;
