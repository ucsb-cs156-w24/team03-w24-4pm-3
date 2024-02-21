
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbMenuItemReviewsFixtures } from "fixtures/ucsbMenuItemReviewsFixtures";
import { rest } from "msw";

import UCSBMenuItemReviewsEditPage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsEditPage";

export default {
    title: 'pages/UCSBMenuItemReviews/UCSBMenuItemReviewsEditPage',
    component: UCSBMenuItemReviewsEditPage
};

const Template = () => <UCSBMenuItemReviewsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitemreviews', (_req, res, ctx) => {
            return res(ctx.json(ucsbMenuItemReviewsFixtures.threeMenuItemReviews[0]));
        }),
        rest.put('/api/ucsbmenuitemreviews', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



