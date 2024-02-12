import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBMenuItemReviewsCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbMenuItemReview) => ({
    url: "/api/ucsbmenuitemreviews/post",
    method: "POST",
    params: {
      itemId: ucsbMenuItemReview.itemId,
      reviewerEmail: ucsbMenuItemReview.reviewerEmail,
      stars: ucsbMenuItemReview.stars,
      dateReviewed: ucsbMenuItemReview.dateReviewed,
      comments: ucsbMenuItemReview.comments
    }
  });

  const onSuccess = (ucsbMenuItemReview) => {
    toast(`New menuItemReview Created - id: ${ucsbMenuItemReview.id} itemId: ${ucsbMenuItemReview.itemId} stars: ${ucsbMenuItemReview.stars}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbmenuitemreviews/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbmenuitemreviews" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New MenuItemReview</h1>

        <UCSBMenuItemReviewForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}