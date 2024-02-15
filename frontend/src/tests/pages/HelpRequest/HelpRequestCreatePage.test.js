import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /helprequest", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 3,
            requesterEmail: "one@email.com",
            teamId: "01",
            tableOrBreakoutRoom: "01",
            requestTime: "2024-01-01T00:00",
            explanation: "dokku",
            solved: false
        };

        axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamID");
        const tableOrBreakoutRoomEmailField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solveButton = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: "one@email.com" } });
        fireEvent.change(teamIdField, { target: { value: '01' } });
        fireEvent.change(tableOrBreakoutRoomEmailField, { target: { value: '01' } });
        fireEvent.change(requestTimeField, { target: { value: "2024-01-01T00:00" } });
        fireEvent.change(explanationField, { target: { value: "dokku" } });
        fireEvent.click(solveButton);
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "requesterEmail": "one@email.com",
            "teamId": "01",
            "tableOrBreakoutRoom": "01",
            "requestTime": "2024-01-01T00:00",
            "explanation": "dokku",
            "solved": true
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New help request Created - id: 3 requesterEmail: one@email.com");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

    });
});