import { useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import { toast } from "react-toastify";

const useDeleteRow = (url, setData = null) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteHandler = () => {
    setDeleteLoading(true);
    axiosInstance
      .post(url + deletingId)
      .then((res) => {
        setDeleteLoading(false);
        setModalOpen(false);

        if (setData) {
          setData((articles) => {
            const newArticles = articles.data.filter(
              (article) => article._id !== deletingId
            );
            return { ...articles, data: newArticles };
          });
        }
        toast.success("restored successfully.");
      })
      .catch((err) => {
        setDeleteLoading(false);
      });
  };

  const openModalHandler = (id) => {
    setModalOpen(true);
    setDeletingId(id);
  };

  return {
    modalOpen,
    deletingId,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  };
};

export default useDeleteRow;
