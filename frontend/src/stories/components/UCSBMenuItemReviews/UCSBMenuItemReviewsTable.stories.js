import React from 'react';
import UCSBMenuItemReviewsTable from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewsTable";
import { ucsbMenuItemReviewsFixtures } from 'fixtures/ucsbMenuItemReviewsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBMenuItemReviews/UCSBMenuItemReviewsTable',
    component: UCSBMenuItemReviewsTable
};

const Template = (args) => {
    return (
        <UCSBMenuItemReviewsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    menuItemReviews: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    menuItemReviews: ucsbMenuItemReviewsFixtures.threeMenuItemReviews,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    menuItemReviews: ucsbMenuItemReviewsFixtures.threeMenuItemReviews,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsbmenuitemreviews', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

