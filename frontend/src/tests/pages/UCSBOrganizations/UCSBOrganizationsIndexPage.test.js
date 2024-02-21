import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
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

describe("UCSBOrganizationsIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBOrganizationsTable";

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
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Create Organizations/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Organizations/);
        expect(button).toHaveAttribute("href", "/ucsborganizations/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three organizations correctly for regular user", async () => {
        
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").reply(200, ucsbOrganizationsFixtures.threeOrganizations);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("ZPR"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("DSP");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("ZBT");

        // assert that the Create button is not present when user isn't an admin
        expect(screen.queryByText(/Create Organization/)).not.toBeInTheDocument();

    });


    test("renders empty table when backend unavailable, user only", async () => {
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsborganizations/all");
        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-orgCode`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsborganizations/all").reply(200, ucsbOrganizationsFixtures.threeOrganizations);
        axiosMock.onDelete("/api/ucsborganizations").reply(200, "UCSBOrganization with orgCode ZPR was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("ZPR");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBOrganization with orgCode ZPR was deleted") });

    });

});