import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import qs from "qs";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useQueryParam from "../../../hooks/useQueryParam";

const BlogCategoryGet = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [myQuery, setMyQuery] = useState("");

  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const {
    loading,
    data: blogCategories,
    setData: setBlogCategories,
    getData,
  } = useGetData();

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
      getData("/admin/blog-categories?page=" + currentPage + "&" + myQuery);
    } else {
      getData("/admin/blog-categories?page=" + currentPage);
    }
  }, [getData, currentPage, myQuery]);

  useEffect(() => {
    if (!blogCategories) {
      return;
    }
    setPageCount(blogCategories.meta?.lastPage || 0);
  }, [blogCategories]);

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
  } = useDeleteRow("/admin/blog-categories/", setBlogCategories);

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

  return (
    <React.Fragment>
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

      <div className="card mb-12rem">
        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <Button
              variant="contained"
              component={Link}
              to="/blog-categories/create"
            >
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Blog Category
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

          <Button
            variant="contained"
            style={{ marginLeft: "10px" }}
            component={Link}
            color={"error"}
            to="/blog-categories/trash"
          >
            <DeleteForeverRoundedIcon
              style={{ fontSize: 18, marginRight: "5px" }}
            />
            Trash
          </Button>
        </div>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete Blog Category"}
            deleteHandler={() => {
              deleteHandler();
            }}
            content={"Are You Sure?"}
          />
        </AppModal>

        <div className="scroll-x mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Slug</th>
                <th scope="col">Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={6} />
              ) : blogCategories?.data?.length > 0 ? (
                blogCategories?.data.map((blogCategory, index) => (
                  <tr key={blogCategory._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{blogCategory.title}</td>
                    <td>{blogCategory.categoryId?.title}</td>

                    <td>{blogCategory.slug}</td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          blogCategory.image
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/main/" +
                              blogCategory.image.fileName
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="blogCategory"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <Link
                        className="me-3"
                        to={"/blog-categories/" + blogCategory._id}
                      >
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <span
                        onClick={() => {
                          openModalHandler(blogCategory._id);
                        }}
                        className="cursor-pointer me-3"
                      >
                        <DeleteForeverTwoToneIcon className="action-icons color-red-500 " />
                      </span>
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
          {blogCategories?.data.length > 0 ? (
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

export default BlogCategoryGet;
