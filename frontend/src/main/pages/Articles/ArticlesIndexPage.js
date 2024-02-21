import React from 'react';
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticlesTable from 'main/components/Articles/ArticlesTable'; // Ensure this component exists
import { Button } from 'react-bootstrap';
import { useCurrentUser, hasRole } from 'main/utils/currentUser';

export default function ArticlesIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/articles/create" // Adjusted for articles
                style={{ float: "right" }}
            >
                Create Article // Adjusted for articles
            </Button>
        );
    } 
  };
  
  const { data: articles, error: _error, status: _status } =
    useBackend(
      ["/api/articles/all"], // Adjusted for articles
      { method: "GET", url: "/api/articles/all" }, // Adjusted for articles
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Articles</h1> // Adjusted for articles
        <ArticlesTable articles={articles} currentUser={currentUser} /> // Adjusted for articles. Ensure this component exists and is correctly implemented
      </div>
    </BasicLayout>
  );
}
