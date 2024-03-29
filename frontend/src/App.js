import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";


import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";


import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

import UCSBMenuItemReviewsIndexPage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsIndexPage";
import UCSBMenuItemReviewsCreatePage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsCreatePage";
import UCSBMenuItemReviewsEditPage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsEditPage";

import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";


import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {/* dates */}
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }
        {/* menuitem review */}
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/menuitemreview" element={<UCSBMenuItemReviewsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/menuitemreview/edit/:id" element={<UCSBMenuItemReviewsEditPage />} />
              <Route exact path="/menuitemreview/create" element={<UCSBMenuItemReviewsCreatePage />} />
            </>
          )
        }
        {/* help request */}
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/helprequests" element={<HelpRequestIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/helprequests/edit/:id" element={<HelpRequestEditPage />} />
              <Route exact path="/helprequests/create" element={<HelpRequestCreatePage />} />
            </>
          )
        }
        {/* recommendations */}
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/recommendationrequest" element={<RecommendationRequestIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/recommendationrequest/edit/:id" element={<RecommendationRequestEditPage />} />
              <Route exact path="/recommendationrequest/create" element={<RecommendationRequestCreatePage />} />
            </>
          )
        }
        {/* restaurants */}
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
            </>
          )
        }
        {/* placeholder */}
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/placeholder/edit/:id" element={<PlaceholderEditPage />} />
              <Route exact path="/placeholder/create" element={<PlaceholderCreatePage />} />
            </>
          )
        }
         {/* articles */}
        {
         hasRole(currentUser, "ROLE_USER") && (
           <>
             <Route exact path="/articles" element={<ArticlesIndexPage />} />
           </>
         )
       }
       {
         hasRole(currentUser, "ROLE_ADMIN") && (
           <>
             <Route exact path="/articles/edit/:id" element={<ArticlesEditPage />} />
             <Route exact path="/articles/create" element={<ArticlesCreatePage />} />
           </>
         )
       }
       {/* organizations */}
       {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsborganizations" element={<UCSBOrganizationsIndexPage />} />
            </>
          )
       }
       {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsborganizations/create" element={<UCSBOrganizationsCreatePage />} />
              <Route exact path="/ucsborganizations/edit/:orgCode" element={<UCSBOrganizationsEditPage />} />
            </>
          )
       }
       {/* Menu Items */}
       {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdiningcommonsmenuitems" element={<UCSBDiningCommonsMenuItemIndexPage />} />
            </>
          )
       }
       {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdiningcommonsmenuitems/create" element={<UCSBDiningCommonsMenuItemCreatePage />} />
              <Route exact path="/ucsbdiningcommonsmenuitems/edit/:id" element={<UCSBDiningCommonsMenuItemEditPage />} />
            </>
          )
       }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
