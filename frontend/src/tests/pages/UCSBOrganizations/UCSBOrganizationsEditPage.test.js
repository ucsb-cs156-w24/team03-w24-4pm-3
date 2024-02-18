import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

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

describe("UCSBOrganizationsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBOrganizations");
            expect(screen.queryByTestId("UCSBOrganizationsForm-orgCode")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsborganizations", { params: { id: 17 } }).reply(200, {
                id: 17,
                orgCode: 'ZPR',
                orgTranslationShort: "ZPR",
                orgTranslation: "Zeta Phi Rho",
                inactive: "true"
            });
            axiosMock.onPut('/api/ucsborganizations').reply(200, {
                id: "17",
                orgCode: "DSP",
                orgTranslationShort: "DSP",
                orgTranslation: "Delta Sigma Pi",
                inactive: "false"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationsForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
            const orgInactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

            fireEvent.change(orgCodeField, { target: { value: 'ZPR' } });
            fireEvent.change(orgTranslationShortField, { target: { value: 'ZPR' } });
            fireEvent.change(orgTranslationField, { target: { value: 'Zeta Phi Rho' } });
            fireEvent.change(orgInactiveField, { target: { value: 'true' } });
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationsForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
            const orgInactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

            fireEvent.change(orgCodeField, { target: { value: 'DSP' } });
            fireEvent.change(orgTranslationShortField, { target: { value: 'DSP' } });
            fireEvent.change(orgTranslationField, { target: { value: 'Delta Sigma Pi' } });
            fireEvent.change(orgInactiveField, { target: { value: 'false' } });
            expect(submitButton).toBeInTheDocument();

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganizations Updated - id: 17 orgCode: DSP");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: "DSP",
                orgTranslationShort: "DSP",
                orgTranslation: "Delta Sigma Pi",
                inactive: "false"
            })); // posted object

        });

       
    });
});


