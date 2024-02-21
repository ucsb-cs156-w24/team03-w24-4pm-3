import React from 'react';
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewForm"
import { ucsbMenuItemReviewsFixtures } from 'fixtures/ucsbMenuItemReviewsFixtures';

export default {
    title: 'components/UCSBMenuItemReviews/UCSBMenuItemReviewForm',
    component: UCSBMenuItemReviewForm
};


const Template = (args) => {
    return (
        <UCSBMenuItemReviewForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ucsbMenuItemReviewsFixtures.oneMenuItemReview,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};
