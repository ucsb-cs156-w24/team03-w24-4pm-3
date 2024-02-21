import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { articlesFixtures } from "fixtures/articlesFixtures"; // Ensure this fixture exists for articles
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

describe("ArticlesIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ArticlesTable"; 

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/articles/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Article/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Article/);
        expect(button).toHaveAttribute("href", "/articles/create");
    });

    test("renders three articles correctly for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/articles/all").reply(200, articlesFixtures.threeArticles);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { 
            expect(screen.getByTestId("ArticlesTable-cell-row-0-col-id")).toHaveTextContent("2"); 
        });
        expect(screen.getByTestId("ArticlesTable-cell-row-1-col-id")).toHaveTextContent("3");
        expect(screen.getByTestId("ArticlesTable-cell-row-2-col-id")).toHaveTextContent("4");
    
        expect(screen.queryByText(/Create Article/)).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/articles/all").timeout();
        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        restoreConsole();
    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/articles/all").reply(200, articlesFixtures.threeArticles);
        axiosMock.onDelete("/api/articles").reply(200, "Article with id 1 was deleted");

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });
        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        fireEvent.click(deleteButton);
        await waitFor(() => { expect(mockToast).toBeCalledWith("Article with id 1 was deleted") });
    });

});
