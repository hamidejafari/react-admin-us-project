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

const CouponGet = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(null);
  const [params, setParams] = useQueryParam("page");
  const { loading, data: coupons, setData: setCoupons, getData } = useGetData();

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

    getData("/admin/coupons?page=" + currentPage);
  }, [getData, currentPage]);

  useEffect(() => {
    if (!coupons) {
      return;
    }
    setPageCount(coupons.meta?.lastPage || 0);
  }, [coupons]);

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
  } = useDeleteRow("/admin/coupons/", setCoupons);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <div className="d-flex w-100 justify-content-space-between">
          <div>
            <Button variant="contained" component={Link} to="/coupons/create">
              <AddCircleTwoToneIcon
                style={{ fontSize: 18, marginRight: "5px" }}
              />
              New Coupon
            </Button>
          </div>
        </div>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete Coupon"}
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
                <th scope="col">title</th>
                <th scope="col">code</th>
                <th scope="col">product</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={5} />
              ) : coupons?.data?.length > 0 ? (
                coupons?.data.map((coupon, index) => (
                  <tr key={coupon._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{coupon.title}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.productId?.title}</td>
                    <td className="white-space-nowrap">
                      <Link className="me-3" to={"/coupons/" + coupon._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <span
                        onClick={() => {
                          openModalHandler(coupon._id);
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

          {coupons?.data.length > 0 ? (
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

export default CouponGet;
