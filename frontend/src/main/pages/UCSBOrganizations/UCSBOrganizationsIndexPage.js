import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationsTable from 'main/components/UCSBOrganizations/UCSBOrganizationsTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function UCSBOrganizationsIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/ucsborganizations/create"
                style={{ float: "right" }}
            >
                Create Organizations
            </Button>
        )
    } 
  }
  
  const { data: Organizations, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/ucsborganizations/all"],
      { method: "GET", url: "/api/ucsborganizations/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSB Organization</h1>
        <UCSBOrganizationsTable organizations={Organizations} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}