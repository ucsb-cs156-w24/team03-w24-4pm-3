import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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
        toast: (x) => mockToast(x),
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; },
    };
});

describe("ArticlesCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

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
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend including date", async () => {
        const queryClient = new QueryClient();
        const articleData = {
            title: "Test Article",
            url: "http://testarticle.com",
            explanation: "This is a test",
            email: "test@article.com",
            dateAdded: "2024-02-14T00:00"
        };

        axiosMock.onPost("/api/articles/post").reply(202, { ...articleData, id: 1 });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const titleInput = await screen.findByTestId("ArticlesForm-title");
        const urlInput = await screen.findByTestId("ArticlesForm-url");
        const explanationInput = await screen.findByTestId("ArticlesForm-explanation");
        const emailInput = await screen.findByTestId("ArticlesForm-email");
        const dateAddedInput = await screen.findByTestId("ArticlesForm-dateAdded");
        const submitButton = await screen.findByTestId("ArticlesForm-submit");

        fireEvent.change(titleInput, { target: { value: articleData.title } });
        fireEvent.change(urlInput, { target: { value: articleData.url } });
        fireEvent.change(explanationInput, { target: { value: articleData.explanation } });
        fireEvent.change(emailInput, { target: { value: articleData.email } });
        fireEvent.change(dateAddedInput, { target: { value: articleData.dateAdded } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axiosMock.history.post[0].params).toEqual(
                {
                    title: "Test Article",
                    url: "http://testarticle.com",
                    explanation: "This is a test",
                    email: "test@article.com",
                    dateAdded: "2024-02-14T00:00"
            });
        });

        expect(mockToast).toHaveBeenCalledWith(expect.stringContaining("Test Article"));

        expect(mockNavigate).toHaveBeenCalledWith({ "to": "/articles" });
    });
});
