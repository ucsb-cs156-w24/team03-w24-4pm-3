import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDiningCommonsMenuItemUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemTable({
    diningCommonMenuItems,
    currentUser,
    testIdPrefix = "UCSBDiningCommonsMenuItemTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbdiningcommonsmenuitems/edit/${cell.row.values.id}`)
    }

    // Stryker disable all
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbdiningcommonsmenuitems/all"]
    );
   // Stryker restore all

    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', 
        },

        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Dining Commons Code',
            accessor: 'diningCommonsCode',
        },
        {
            Header: 'Station',
            accessor: 'station',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={diningCommonMenuItems}
        columns={columns}
        testid={testIdPrefix}
    />;
};