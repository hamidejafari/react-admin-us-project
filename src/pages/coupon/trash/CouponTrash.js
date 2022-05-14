import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";

import useGetData from "../../../hooks/useGetData";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import RestoreModal from "../../../components/UI/RestoreModal/RestoreModal";
import useQueryParam from "../../../hooks/useQueryParam";
import useRestoreRow from "../../../hooks/useRestoreRow";

const CouponTrash = () => {
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

    getData("/admin/coupons/trash?page=" + currentPage);
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
  } = useRestoreRow("/admin/coupons/restore/", setCoupons);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <RestoreModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"restore coupon"}
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
                <th scope="col">type</th>
                <th scope="col">on model</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={6} />
              ) : coupons?.data?.length > 0 ? (
                coupons?.data.map((coupon, index) => (
                  <tr key={coupon._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{coupon.title}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.onModel}</td>
                    <td>{coupon.modelId?.title}</td>

                    <td className="white-space-nowrap">
                      <span
                        onClick={() => {
                          openModalHandler(coupon._id);
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

export default CouponTrash;
