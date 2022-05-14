import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";

import useGetData from "../../../hooks/useGetData";
import useDeleteRow from "../../../hooks/useDeleteRow";
import SkeletonTableLoading from "../../../components/UI/SkeletonTableLoading/SkeletonTableLoading";
import AppModal from "../../../components/UI/AppModal/AppModal";
import DeleteModal from "../../../components/UI/DeleteModal/DeleteModal";

const GetAdmin = () => {
  const { loading, data: users, setData: setUsers, getData } = useGetData();

  useEffect(() => {
    getData("/admin/all-admins");
  }, [getData]);

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/users/", setUsers);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <Button variant="contained" component={Link} to="/users/create-admin">
          <AddCircleTwoToneIcon style={{ fontSize: 18, marginRight: "5px" }} />
          New User
        </Button>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete User"}
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
                <th scope="col">Family</th>
                <th scope="col">Phone</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={6} />
              ) : users?.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.family}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      {user.permissions
                        ? user.permissions.map((permission, index2) => (
                            <span key="index2">{permission?.title}&nbsp;</span>
                          ))
                        : null}
                    </td>
                    <td className="white-space-nowrap">
                      <Link className="me-3" to={"/users/edit-admin/" + user._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <span
                        onClick={() => {
                          openModalHandler(user._id);
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default GetAdmin;
