import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";

import useGetData from "../../../hooks/useGetData";
import useRestoreRow from "../../../hooks/useRestoreRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import RestoreModal from "../../../components/UI/RestoreModal/RestoreModal";
import useQueryParam from "../../../hooks/useQueryParam";

const BlogTrash = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const { loading, data: blogs, setData: setBlogs, getData } = useGetData();

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

    getData("/admin/blogs/trash?page=" + currentPage);
  }, [getData, currentPage]);

  useEffect(() => {
    if (!blogs) {
      return;
    }
    setPageCount(blogs.meta?.lastPage || 0);
  }, [blogs]);

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
  } = useRestoreRow("/admin/blogs/restore/", setBlogs);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">

          <RestoreModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"restore Blog"}
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
                <th scope="col">Best Category</th>
                <th scope="col">Blog Category</th>
                <th scope="col">Slug</th>
                <th scope="col">Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={7} />
              ) : blogs?.data?.length > 0 ? (
                blogs?.data.map((blog, index) => (
                  <tr key={blog._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{blog.title}</td>
                    <td>{blog.categoryId?.title}</td>
                    <td>{blog.blogCategoryId?.title}</td>
                    <td>{blog.slug}</td>
                    <td>
                      <img
                        className="table-img"
                        src={
                          blog.image
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/" +
                              blog.image
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="blog"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <span
                        onClick={() => {
                          openModalHandler(blog._id);
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

          {blogs?.data.length > 0 ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                page={currentPage}
                onChange={handleChangePage}
                count={pageCount}
                color="primary"
              />
            </div>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogTrash;
