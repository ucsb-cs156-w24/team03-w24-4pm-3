import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
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

describe("UCSBOrganizationsCreatePage tests", () => {

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
                    <UCSBOrganizationsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbOrganizations = {
            orgCode: "ZPR",
            orgTranslationShort: "Zeta Phi Rho",
            orgTranslation: "Zeta Phi Rho (ZPR)",
            inactive: "true"
        };

        axiosMock.onPost("/api/ucsborganizations/post").reply( 202, ucsbOrganizations );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UCSBOrganizationsForm-orgCode")).toBeInTheDocument();
        });

        await screen.findByTestId("UCSBOrganizationsForm-orgCode");

        const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
        const orgInactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'ZPR' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'Zeta Phi Rho' } });
        fireEvent.change(orgTranslationField, { target: { value: 'Zeta Phi Rho (ZPR)' } });
        fireEvent.change(orgInactiveField, { target: { value: 'true' } });

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "orgCode": "ZPR",
            "orgTranslationShort": "Zeta Phi Rho",
            "orgTranslation": "Zeta Phi Rho (ZPR)",
            "inactive": "true"
        });

        expect(mockToast).toBeCalledWith("New ucsbOrganizations Created orgCode: ZPR");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });
    });


});


