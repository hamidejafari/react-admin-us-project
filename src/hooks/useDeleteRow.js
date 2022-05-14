import { useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import { toast } from "react-toastify";

const useDeleteRow = (url, setData = null) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [relations, setRelations] = useState([]);

  const deleteHandler = () => {
    setDeleteLoading(true);
    axiosInstance
      .delete(url + deletingId)
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
        toast.success("deleted successfully.");
      })
      .catch((err) => {
        setDeleteLoading(false);
        if (err?.response?.status === 400) {
          toast.warning(err?.response?.data?.message);
          if (err?.response?.data?.data) {
            setRelations(err?.response?.data?.data);
          }
        }
      });
  };

  const openModalHandler = (id) => {
    setModalOpen(true);
    setRelations([]);
    setDeletingId(id);
  };

  return {
    modalOpen,
    deletingId,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
    relations,
  };
};

export default useDeleteRow;
