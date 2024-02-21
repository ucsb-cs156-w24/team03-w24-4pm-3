
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbMenuItemReviewsFixtures } from "fixtures/ucsbMenuItemReviewsFixtures";
import { rest } from "msw";

import UCSBMenuItemReviewsIndexPage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsIndexPage";

export default {
    title: 'pages/UCSBMenuItemReviews/UCSBMenuItemReviewsIndexPage',
    component: UCSBMenuItemReviewsIndexPage
};

const Template = () => <UCSBMenuItemReviewsIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitemreviews/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitemreviews/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbMenuItemReviewsFixtures.threeMenuItemReviews));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbmenuitemreviews/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbMenuItemReviewsFixtures.threeMenuItemReviews));
        }),
        rest.delete('/api/ucsbenuitemreviews', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}
