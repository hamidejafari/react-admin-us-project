import React, { useEffect, useState } from "react";
import {  Pagination } from "@mui/material";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import useQueryParam from "../../../hooks/useQueryParam";
import RestoreModal from "../../../components/UI/RestoreModal/RestoreModal";
import useRestoreRow from "../../../hooks/useRestoreRow";

const BlogCategoryGet = () => {
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

    getData("/admin/blog-categories/trash?page=" + currentPage);
  }, [getData, currentPage]);

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
  } = useRestoreRow("/admin/blog-categories/restore/", setBlogCategories);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <RestoreModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"restore Blog Category"}
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
                              "/" +
                              blogCategory.image
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="blogCategory"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <span
                        onClick={() => {
                          openModalHandler(blogCategory._id);
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
