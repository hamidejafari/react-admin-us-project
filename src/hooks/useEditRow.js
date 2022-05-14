import { useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import { toast } from "react-toastify";

const useEditRow = (
  url,
  setData = null,
  setRefreshData,
  dispatch,
  getCountAction
) => {
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [editId, setEditId] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [contentReview, setContentReview] = useState("");
  const [showHomePage, setShowHomePage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [reviewStar, setReviewStar] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [editLoading, setEditLoading] = useState(false);

  const editHandler = () => {
    setEditLoading(true);
    const content =
      window.tinymce?.get(`contentReview`) &&
      window.tinymce?.get(`contentReview`).getContent();
    axiosInstance
      .put("/admin/reviews/" + editId, {
        status: selectedStatus?.value,
        showHomePage: showHomePage,
        content: content,
        createdAt: createdAt,
        star: reviewStar,
      })
      .then((res) => {
        setEditLoading(false);
        setModalOpenEdit(false);
        setRefreshData(editId + selectedStatus?.value);
        dispatch(getCountAction);

        toast.success("Updated Successfully.");
      })
      .catch((err) => {
        setEditLoading(false);
      });
  };

  const openModalHandlerEdit = (
    id,
    status,
    content,
    showHomePage,
    reviewUserEmail,
    createdAt,
    reviewStar
  ) => {
    setModalOpenEdit(true);
    setEditId(id);
    setContentReview(content);
    setCreatedAt(createdAt);
    setShowHomePage(showHomePage);
    setSelectedStatus({ label: status, value: status });
    setUserEmail(reviewUserEmail);
    setReviewStar(reviewStar);
  };

  return {
    modalOpenEdit,
    editId,
    editLoading,
    editHandler,
    openModalHandlerEdit,
    setModalOpenEdit,
    contentReview,
    setContentReview,
    selectedStatus,
    showHomePage,
    setShowHomePage,
    userEmail,
    createdAt,
    setCreatedAt,
    setSelectedStatus,
    reviewStar,
    setReviewStar,
  };
};

export default useEditRow;
