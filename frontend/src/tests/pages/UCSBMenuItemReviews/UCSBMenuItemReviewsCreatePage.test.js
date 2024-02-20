import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBMenuItemReviewsCreatePage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBMenuItemReviewsCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBMenuItemReviewsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbMenuItemReview = {
            id: 17,
            itemId: 3,
            reviewerEmail: "berrylover@ucsb.edu",
            stars: 5,
            dateReviewed: "2022-01-02T12:00",
            comments: "berry good"
        };

        axiosMock.onPost("/api/ucsbmenuitemreviews/post").reply( 202, ucsbMenuItemReview );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBMenuItemReviewsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UCSBMenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdField = screen.getByTestId("UCSBMenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("UCSBMenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 3 } });
        fireEvent.change(reviewerEmailField, { target: { value: "berrylover@ucsb.edu" } });
        fireEvent.change(starsField, { target: { value: 5 } });
        fireEvent.change(dateReviewedField, { target: { value: '2023-01-02T12:00' } });
        fireEvent.change(commentsField, { target: { value: "berry good" } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "itemId": "3",
            "reviewerEmail": "berrylover@ucsb.edu",
            "stars": "5",
            "dateReviewed": "2023-01-02T12:00",
            "comments": "berry good"
        });

        expect(mockToast).toBeCalledWith("New menuItemReview Created - id: 17 itemId: 3 stars: 5");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });


});


