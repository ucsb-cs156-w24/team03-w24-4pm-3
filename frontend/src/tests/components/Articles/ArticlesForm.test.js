import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();
const expectedHeaders = ["Title", "URL", "Explanation", "Email", "Date Added"]; 

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesForm tests", () => {
    const queryClient = new QueryClient();

    test("renders correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        await screen.findByText(/Create/);
        expectedHeaders.forEach((headerText) => {
            expect(screen.getByText(headerText)).toBeInTheDocument();
        }); 
    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm initialContents={articlesFixtures.oneArticle[0]} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("ArticlesForm-id")).toHaveValue(articlesFixtures.oneArticle[0].id.toString());
    });

    test("Correct Error messages on missing input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date added is required./)).toBeInTheDocument();
    });
    /*
    test("Correct Error messages on bad input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        fireEvent.change(screen.getByTestId("ArticlesForm-url"), { target: { value: "invalidurl" } });
        fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

        await waitFor(() => {
            expect(screen.getByText(/Invalid URL format/)).toBeInTheDocument();
        });
        
    }); */

    test("No Error messages on good input", async () => {
        const mockSubmitAction = jest.fn(); 
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm submitAction={mockSubmitAction} initialContents={articlesFixtures.oneArticle[0]} />
                </Router>
            </QueryClientProvider>
        );

        fireEvent.change(screen.getByTestId("ArticlesForm-title"), { target: { value: "Test Title" } });
        fireEvent.change(screen.getByTestId("ArticlesForm-url"), { target: { value: "http://www.example.com" } });
        fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), { target: { value: "Test Explanation" } });
        fireEvent.change(screen.getByTestId("ArticlesForm-email"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByTestId("ArticlesForm-dateAdded"), { target: { value: "2022-01-01T12:00" } });


        fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByTestId("ArticlesForm-cancel"));

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

});
