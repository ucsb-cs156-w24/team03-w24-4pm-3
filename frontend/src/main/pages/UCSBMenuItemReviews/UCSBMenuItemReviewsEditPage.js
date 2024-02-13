import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBMenuItemReviewsEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: ucsbMenuItemReview, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsbmenuitemreviews?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsbmenuitemreviews`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (ucsbMenuItemReview) => ({
    url: "/api/ucsbmenuitemreviews",
    method: "PUT",
    params: {
      id: ucsbMenuItemReview.id,
    },
    data: {
      itemId: ucsbMenuItemReview.itemId,
      reviewerEmail: ucsbMenuItemReview.reviewerEmail,
      stars: ucsbMenuItemReview.stars,
      dateReviewed: ucsbMenuItemReview.dateReviewed,
      comments: ucsbMenuItemReview.comments
    }
  });

  const onSuccess = (ucsbMenuItemReview) => {
    toast(`MenuItemReview Updated - id: ${ucsbMenuItemReview.id} itemId: ${ucsbMenuItemReview.itemId} stars: ${ucsbMenuItemReview.stars}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbmenuitemreviews?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit MenuItemReview</h1>
        {
          ucsbMenuItemReview && <UCSBMenuItemReviewForm initialContents={ucsbMenuItemReview} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

