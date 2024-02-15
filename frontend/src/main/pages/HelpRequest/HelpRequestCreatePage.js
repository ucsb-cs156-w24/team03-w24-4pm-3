import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDatesCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbDate) => ({
    url: "/api/helprequests/post",
    method: "POST",
    params: {
        requesterEmail: helpRequest.requesterEmail,
        teamId: helpRequest.teamId,
        tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
        date: helpRequest.requestTime,
        explanation: helpRequest.explanation,
        solved: helpRequest.solved
    }
  });

  const onSuccess = (helpRequest) => {
    toast(`New helpRequest Created - id: ${helpRequest.id} requesterEmail: ${helpRequest.requesterEmail}`);
  }


  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequests/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helpRequest" /> 
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDate</h1>

        <HelpRequestForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}