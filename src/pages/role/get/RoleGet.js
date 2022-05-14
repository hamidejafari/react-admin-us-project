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

const RoleGet = () => {
  const { loading, data: roles, setData: setRoles, getData } = useGetData();

  useEffect(() => {
    getData("/admin/roles");
  }, [getData]);

  const {
    modalOpen,
    deleteLoading,
    deleteHandler,
    openModalHandler,
    setModalOpen,
  } = useDeleteRow("/admin/roles/", setRoles);

  return (
    <React.Fragment>
      <div className="card mb-12rem">
        <Button variant="contained" component={Link} to="/roles/create">
          <AddCircleTwoToneIcon style={{ fontSize: 18, marginRight: "5px" }} />
          New Role
        </Button>

        <AppModal setOpen={setModalOpen} open={modalOpen} width="width-normal">
          <DeleteModal
            deleteLoading={deleteLoading}
            setOpen={setModalOpen}
            header={"Delete Role"}
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
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableLoading column={3} />
              ) : roles?.length > 0 ? (
                roles.map((role, index) => (
                  <tr key={role._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{role.title}</td>
                    <td className="white-space-nowrap">
                      <Link className="me-3" to={"/roles/" + role._id}>
                        <EditTwoToneIcon className="action-icons" />
                      </Link>
                      <span
                        onClick={() => {
                          openModalHandler(role._id);
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
                  <th className="text-center" colSpan="8">
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

export default RoleGet;
