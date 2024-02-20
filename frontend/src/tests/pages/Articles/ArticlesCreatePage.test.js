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

        expect(await screen.findByTestId("ArticlesForm-title")).toBeInTheDocument();

        fireEvent.change(screen.getByTestId("ArticlesForm-title"), { target: { value: articleData.title } });
        fireEvent.change(screen.getByTestId("ArticlesForm-url"), { target: { value: articleData.url } });
        fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), { target: { value: articleData.explanation } });
        fireEvent.change(screen.getByTestId("ArticlesForm-email"), { target: { value: articleData.email } });
        fireEvent.change(screen.getByTestId("ArticlesForm-dateAdded"), { target: { value: articleData.dateAdded } });

        fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                title: "Test Article",
                url: "http://testarticle.com",
                explanation: "This is a test",
                email: "test@article.com",
                dateAdded: "2024-02-14T00:00"
        });

        expect(mockToast).toHaveBeenCalledWith(expect.stringContaining("Test Article"));

        expect(mockNavigate).toHaveBeenCalledWith({ "to": "/articles" });
    });
});
