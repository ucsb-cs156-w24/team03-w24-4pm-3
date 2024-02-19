import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsEditPage({storybook=false}) {
  let { orgCode } = useParams();

  const { data: ucsbOrganizations, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsborganizations?orgCode=${orgCode}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsborganizations`,
        params: {
          orgCode
        }
      }
    );


  const objectToAxiosPutParams = (ucsbOrganizations) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: {
      orgCode: ucsbOrganizations.orgCode,
    },
    data: {
      orgCode: ucsbOrganizations.orgCode,
      orgTranslationShort: ucsbOrganizations.orgTranslationShort,
      orgTranslation: ucsbOrganizations.orgTranslation, 
      inactive: ucsbOrganizations.inactive
    }
  });

  const onSuccess = (ucsbOrganizations) => {
    toast(`UCSBOrganizations Updated orgCode: ${ucsbOrganizations.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsborganizations?orgCode=${orgCode}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit a UCSB Organization</h1>
        {
          ucsbOrganizations && <UCSBOrganizationsForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={ucsbOrganizations} />
        }
      </div>
    </BasicLayout>
  )
}

