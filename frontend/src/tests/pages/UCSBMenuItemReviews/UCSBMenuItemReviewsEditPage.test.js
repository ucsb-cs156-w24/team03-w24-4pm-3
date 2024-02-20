import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBMenuItemReviewsEditPage from "main/pages/UCSBMenuItemReviews/UCSBMenuItemReviewsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBMenuItemReviewsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbmenuitemreviews", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBMenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("UCSBMenuItemReviewForm-itemId")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbmenuitemreviews", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemId: 3,
                reviewerEmail: "berrylover@ucsb.edu",
                stars: 5,
                dateReviewed: "2022-01-02T12:00",
                comments: "berry good"
            });
            axiosMock.onPut('/api/ucsbmenuitemreviews').reply(200, {
                id: 17,
                itemId: 2345,
                reviewerEmail: "student@ucsb.edu",
                stars: 4,
                dateReviewed: "2023-01-02T12:00",
                comments: "not bad"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBMenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBMenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBMenuItemReviewForm-itemId");

            const idField = screen.getByTestId("UCSBMenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("UCSBMenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("UCSBMenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue(3);
            expect(reviewerEmailField).toHaveValue("berrylover@ucsb.edu");
            expect(starsField).toHaveValue(5);
            expect(dateReviewedField).toHaveValue("2022-01-02T12:00");
            expect(commentsField).toHaveValue("berry good");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBMenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBMenuItemReviewForm-itemId");

            const idField = screen.getByTestId("UCSBMenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("UCSBMenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("UCSBMenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue(3);
            expect(reviewerEmailField).toHaveValue("berrylover@ucsb.edu");
            expect(starsField).toHaveValue(5);
            expect(dateReviewedField).toHaveValue("2022-01-02T12:00");
            expect(commentsField).toHaveValue("berry good");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIdField, { target: { value: 2345 } });
            fireEvent.change(reviewerEmailField, { target: { value: "student@ucsb.edu" } });
            fireEvent.change(starsField, { target: { value: 4 } });
            fireEvent.change(dateReviewedField, { target: { value: '2024-01-02T12:00' } });
            fireEvent.change(commentsField, { target: { value: "not bad" } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 17 itemId: 2345 stars: 4");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                "itemId": "2345",
                "reviewerEmail": "student@ucsb.edu",
                "stars": "4",
                "dateReviewed": "2024-01-02T12:00",
                "comments": "not bad"
            })); // posted object

        });

       
    });
});


