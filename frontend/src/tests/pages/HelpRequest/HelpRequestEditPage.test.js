import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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
            id: 3
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequests", { params: { id: 3 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/helprequests", { params: { id: 3 } }).reply(200, {
                id: 3,
                requesterEmail: "two@ucsb.edu",
                teamId: "02",
                tableOrBreakoutRoom: "Table 2",
                requestTime: "2022-04-03T12:00",
                explanation: "Swagger",
                solved: false
            });
            axiosMock.onPut('/api/helprequests').reply(200, {
                id: "3",
                requesterEmail: "twentytwo@ucsb.edu",
                teamId: "07",
                tableOrBreakoutRoom: "Big Table",
                requestTime: "2024-04-03T12:00",
                explanation: "Big Swagger",
                solved: true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");
            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomEmailField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedButton = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("3");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("two@ucsb.edu");
            expect(teamIdField).toBeInTheDocument();
            expect(teamIdField).toHaveValue("02");
            expect(tableOrBreakoutRoomEmailField).toBeInTheDocument();
            expect(tableOrBreakoutRoomEmailField).toHaveValue("Table 2");
            expect(requestTimeField).toBeInTheDocument();
            expect(requestTimeField).toHaveValue("2022-04-03T12:00");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("Swagger");
            expect(solvedButton).toBeInTheDocument();
            expect(solvedButton).not.toBeChecked();

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterEmailField, { target: { value: "two@ucsb.edu" } });
            fireEvent.change(teamIdField, { target: { value: '07' } });
            fireEvent.change(tableOrBreakoutRoomEmailField, { target: { value: 'Table 2' } });
            fireEvent.change(requestTimeField, { target: { value: "2022-04-03T12:00" } });
            fireEvent.change(explanationField, { target: { value: "Swagger" } });
            fireEvent.click(solvedButton);
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 3 requesterEmail: twentytwo@ucsb.edu");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "two@ucsb.edu",
                teamId: "07",
                tableOrBreakoutRoom: "Table 2",
                requestTime: "2022-04-03T12:00",
                explanation: "Swagger",
                solved: true
            }));


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomEmailField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedButton = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("3");
            expect(requesterEmailField).toHaveValue("two@ucsb.edu");
            expect(teamIdField).toHaveValue("02");
            expect(tableOrBreakoutRoomEmailField).toHaveValue("Table 2");
            expect(requestTimeField).toHaveValue("2022-04-03T12:00");
            expect(explanationField).toHaveValue("Swagger");
            expect(solvedButton).not.toBeChecked();

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'twentytwo@ucsb.edu' } })
            fireEvent.change(teamIdField, { target: { value: '07' } })
            fireEvent.change(tableOrBreakoutRoomEmailField, { target: { value: 'Big Table' } })
            fireEvent.change(requestTimeField, { target: { value: "2024-04-03T12:00" } })
            fireEvent.change(explanationField, { target: { value: "Big Swagger" } })
            fireEvent.click(solvedButton);
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 3 requesterEmail: twentytwo@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequests" });
        });


    });
});