import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBMenuItemReviewForm from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewForm";
import { ucsbMenuItemReviewsFixtures } from "fixtures/ucsbMenuItemReviewsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBMenuItemReviewForm tests", () => {

    const expectedHeaders = ["Menu Item ID", "Email", "Stars", "Date (iso format)", "Comments"];

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBMenuItemReviewForm />
            </Router>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });


    test("renders correctly when passing in a UCSBMenuItemReview", async () => {

        render(
            <Router  >
                <UCSBMenuItemReviewForm initialContents={ucsbMenuItemReviewsFixtures.oneMenuItemReview} />
            </Router>
        );
        await screen.findByTestId(/UCSBMenuItemReviewForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBMenuItemReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBMenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemReviewForm-dateReviewed");
        //const quarterYYYYQField = screen.getByTestId("UCSBDateForm-quarterYYYYQ");
        const dateReviewedField = screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed");
        const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars")
        const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.change(starsField, { target: { value: 0 } });
        fireEvent.click(submitButton);
        await screen.findByText(/Minimum rating of 1 star/);

        fireEvent.change(starsField, { target: { value: 10 } });
        fireEvent.click(submitButton);
        await screen.findByText(/Maximum rating of 5 stars/);

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBMenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Menu Item ID is required./);
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars are required./)).toBeInTheDocument();
        expect(screen.getByText(/Date is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBMenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("UCSBMenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("UCSBMenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("UCSBMenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("UCSBMenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("UCSBMenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("UCSBMenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 5 } });
        fireEvent.change(reviewerEmailField, { target: { value: "student@ucsb.edu" } });
        fireEvent.change(starsField, { target: { value: 4 } });
        fireEvent.change(dateReviewedField, { target: { value: '2023-01-02T12:00' } });
        fireEvent.change(commentsField, { target: { value: "not bad" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Minimum rating of 1 star/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Maximum rating of 5 stars/)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateReviewed must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBMenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("UCSBMenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


