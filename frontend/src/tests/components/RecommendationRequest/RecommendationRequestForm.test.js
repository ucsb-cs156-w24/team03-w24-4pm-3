import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestForm tests", () => {
    
    const expectedHeaders = ["RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested (iso format)", "DateNeeded (iso format)", "Done"];
    //const testId = "RecommendationRequestForm";

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });


    test("renders correctly when passing in a RecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: '@ucs.b' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad@e' } });
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email must be a valid email./);
        await screen.findByText(/Professor Email must be a valid email./);
        await screen.findByText(/Requester Email is required./);
        await screen.findByText(/Professor Email is required./);
        await screen.findByText(/Date Requested is required./);
        await screen.findByText(/Date Needed is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bonniehuynh@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'phtcon@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'BS/MS Program' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-02-02T12:00' } });
        fireEvent.change(doneField, { target: { value: 'true' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester Email must be a valid email./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Professor Email must be a valid email./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Requester Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Professor Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Requested is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date requested is needed./)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateRequested must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateNeeded must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


