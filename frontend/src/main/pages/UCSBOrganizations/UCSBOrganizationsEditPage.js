import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: ucsbOrganizations, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsborganizations?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsborganizations`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (ucsbOrganizations) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: {
      id: ucsbOrganizations.id,
    },
    data: {
      orgCode: ucsbOrganizations.orgCode,
      orgTranslationShort: ucsbOrganizations.orgTranslationShort,
      orgTranslation: ucsbOrganizations.orgTranslation, 
      inactive: ucsbOrganizations.inactive
    }
  });

  const onSuccess = (ucsbOrganizations) => {
    toast(`UCSBOrganizations Updated - id: ${ucsbOrganizations.id} orgCode: ${ucsbOrganizations.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsborganizations?id=${id}`]
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
        <h1>Edit UCSBOrganizations</h1>
        {
          ucsbOrganizations && <UCSBOrganizationsForm initialContents={ucsbOrganizations} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

