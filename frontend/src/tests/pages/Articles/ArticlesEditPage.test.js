import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
            id: 42 
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 42 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but form is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Article");
            expect(screen.queryByTestId("ArticlesForm-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);
        const articleData = {
            id: 42,
            title: "Sample Article",
            url: "https://sample.com",
            explanation: "Sample Explanation",
            email: "test@example.com",
            dateAdded: "2022-01-01T00:00"
        };
        
        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 42 } }).reply(200, articleData);
            axiosMock.onPut('/api/articles').reply(200, {
                ...articleData,
                title: "Updated Article Title",
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-title");

            expect(screen.getByTestId("ArticlesForm-title")).toHaveValue(articleData.title);
            expect(screen.getByTestId("ArticlesForm-url")).toHaveValue(articleData.url);
            expect(screen.getByTestId("ArticlesForm-explanation")).toHaveValue(articleData.explanation);
            expect(screen.getByTestId("ArticlesForm-email")).toHaveValue(articleData.email);
            expect(screen.getByTestId("ArticlesForm-dateAdded")).toHaveValue(articleData.dateAdded);
        });

        test("Changes when you click Update", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        
            await screen.findByTestId("ArticlesForm-title");
        
            fireEvent.change(screen.getByTestId("ArticlesForm-title"), { target: { value: "Updated Article Title" } });
            fireEvent.change(screen.getByTestId("ArticlesForm-url"), { target: { value: "http://updatedurl.com" } });
            fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), { target: { value: "Updated explanation" } });
            fireEvent.change(screen.getByTestId("ArticlesForm-email"), { target: { value: "updated@example.com" } });
            fireEvent.change(screen.getByTestId("ArticlesForm-dateAdded"), { target: { value: "2024-01-01T00:00" } }); // Make sure the date is in the correct format
        
            fireEvent.click(screen.getByTestId("ArticlesForm-submit"));
        
            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toHaveBeenCalledWith(expect.stringContaining("Article Updated - id: 42 title: Updated Article Title"));
        
            expect(mockNavigate).toHaveBeenCalledWith({ "to": "/articles" });
        
            await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

            expect(axiosMock.history.put[0].params).toEqual({ id: 42 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Updated Article Title",
                url: "http://updatedurl.com",
                explanation: "Updated explanation",
                email: "updated@example.com",
                dateAdded: "2024-01-01T00:00"
            })); 
        });        
    });
});

