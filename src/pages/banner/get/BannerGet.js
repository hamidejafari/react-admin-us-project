import React, { useEffect, useState } from "react";
import { Button, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";
import useQueryParam from "../../../hooks/useQueryParam";

const BannerGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const { loading, data: banners, setData: setBanners, getData } = useGetData();

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

    getData("/admin/banners?page=" + currentPage);
  }, [getData, currentPage]);

  useEffect(() => {
    if (!banners) {
      return;
    }
    setPageCount(banners.meta?.lastPage || 0);
  }, [banners]);

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
  } = useDeleteRow("/admin/banners/", setBanners);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <Button variant="contained" component={Link} to="/banners/create">
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Banner
            </Button>
          </div>
        </div>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete Banner"}
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
                <th scope="col">type</th>
                <th scope="col">on model</th>
                <th scope="col">image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={5} />
              ) : banners?.data?.length > 0 ? (
                banners?.data.map((banner, index) => (
                  <tr key={banner._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{banner.onModel}</td>
                    <td>{banner.modelId?.title}</td>

                    <td>
                      <img
                        className="table-img"
                        src={
                          banner.image?.fileName
                            ? process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/main/" +
                              banner.image.fileName
                            : process.env.REACT_APP_BACKEND_API_URL +
                              "/files/images/placeholder/160x90.webp"
                        }
                        alt="banner"
                      />
                    </td>
                    <td className="white-space-nowrap">
                      <Link className="me-3" to={"/banners/" + banner._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <span
                        onClick={() => {
                          openModalHandler(banner._id);
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
                  <th className="text-center" colSpan="5">
                    Not Found
                  </th>
                </tr>
              )}
            </tbody>
          </table>

          {banners?.data.length > 0 ? (
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

export default BannerGet;
