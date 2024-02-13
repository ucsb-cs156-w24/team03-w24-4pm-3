import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbMenuItemReviewsFixtures } from "fixtures/ucsbMenuItemReviewsFixtures";
import UCSBMenuItemReviewsTable from "main/components/UCSBMenuItemReviews/UCSBMenuItemReviewsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBMenuItemReviewTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Menu Item ID", "Email", "Stars", "Date (iso format)", "Comments"];
  const expectedFields = ["id", "itemId", "reviewerEmail", "stars", "dateReviewed", "comments"];
  const testId = "UCSBMenuItemReviewsTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    console.log(currentUser);
    console.log(expectedHeaders);
    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewsTable menuItemReviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewsTable menuItemReviews={ucsbMenuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("bananahater@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2023-01-02T12:00:00");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("bad");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("298089");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("joe@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-01-02T12:00:00");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-comments`)).toHaveTextContent("mid");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewsTable menuItemReviews={ucsbMenuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("bananahater@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2023-01-02T12:00:00");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("bad");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("298089");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("joe@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-01-02T12:00:00");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-comments`)).toHaveTextContent("mid");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewsTable menuItemReviews={ucsbMenuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("298089");

    const editButton = screen.getByTestId(`${testId}-cell-row-2-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/menuitemreview/edit/3'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBMenuItemReviewsTable menuItemReviews={ucsbMenuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("298089");

    const deleteButton1 = screen.getByTestId(`${testId}-cell-row-1-col-Delete-button`);
    expect(deleteButton1).toBeInTheDocument();
    const deleteButton2 = screen.getByTestId(`${testId}-cell-row-2-col-Delete-button`);
    expect(deleteButton2).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton1);
    fireEvent.click(deleteButton2);
  });
});
