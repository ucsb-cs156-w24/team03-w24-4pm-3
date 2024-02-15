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

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const requesterEmail = {
            id: 17,
          requesterEmail: "one@ucsb.edu",
          teamId: "01",
          tableOrBreakoutRoom: "table01",
          requestTime: "2022-02-02T00:00",
          explanation: "Dokku",
          solved: true
        };

        axiosMock.onPost("/api/helprequests/post").reply(202, requesterEmail);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("RequesterEmail")).toBeInTheDocument();
        });

        const emailInput = screen.getByLabelText("RequesterEmail");
        expect(emailInput).toBeInTheDocument();

        const teamInput = screen.getByLabelText("TeamID");
        expect(teamInput).toBeInTheDocument();

        const tableInput = screen.getByLabelText("TableOrBreakoutRoom");
        expect(tableInput).toBeInTheDocument();

        const timeInput = screen.getByLabelText("RequestTime");
        expect(timeInput).toBeInTheDocument();

        const explanationInput = screen.getByLabelText("Explanation");
        expect(explanationInput).toBeInTheDocument();

        const solvedInput = screen.getByTestId("HelpRequestForm-solved");
        expect(solvedInput).toBeInTheDocument();

        const submitInput = screen.getByTestId("HelpRequestForm-submit");
        expect(submitInput).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'one@ucsb.edu' } })
        fireEvent.change(teamInput, { target: { value: '01' } })
        fireEvent.change(tableInput, { target: { value: 'table01' } })
        fireEvent.change(timeInput, { target: { value: '2022-02-02T00:00' } })
        fireEvent.change(explanationInput, { target: { value: "Dokku" } })
        fireEvent.change(solvedInput, { target: { value: true } })
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
        requesterEmail: "one@ucsb.edu",
          teamId: "01",
          tableOrBreakoutRoom: "table01",
          date: "2022-02-02T00:00",
          explanation: "Dokku",
          solved: true
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 17 requesterEmail: FakeElfouly@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/helpRequest" });

    });
});