import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBOrganizationsForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByText(/Organization Code/);
        await screen.findByText(/Create/);
    });


    // test("renders correctly when passing in a UCSBOrganization", async () => {

    //     render(
    //         <Router  >
    //             <UCSBOrganizationsForm initialContents={ucsbOrganizationsFixtures.oneOrganization} />
    //         </Router>
    //     );
    //     await screen.findByTestId(/UCSBOrganizationsForm-orgCode/);
    //     expect(screen.getByText(/Organization Code/)).toBeInTheDocument();
    //     expect(screen.getByTestId(/UCSBOrganizationsForm-orgCode/)).toHaveValue("ZBT");
    // });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
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
        fireEvent.change(orgInactiveField, { target: { value: 'FLSE' } });
        fireEvent.click(submitButton);

        fireEvent.click(submitButton);

        await screen.findByText(/inactive must be in the format true or false/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-submit");
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/orgCode is required./);
        expect(screen.getByText(/orgTranslationShort is required./)).toBeInTheDocument();
        expect(screen.getByText(/orgTranslation is required./)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBOrganizationsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-orgCode");

        await screen.findByTestId("UCSBOrganizationsForm-orgCode");
        const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
        const orgInactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'DSP' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'DSP' } });
        fireEvent.change(orgTranslationField, { target: { value: 'Delta Sigma Pi' } });
        fireEvent.change(orgInactiveField, { target: { value: 'true' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/inactive must be in the format true or false/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBOrganizationsForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationsForm-cancel");
        const cancelButton = screen.getByTestId("UCSBOrganizationsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


