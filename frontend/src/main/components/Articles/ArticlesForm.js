import { Button, Form} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function ArticlesForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all  
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {} }
    );
    // Stryker restore all

    const navigate = useNavigate();
    const testIdPrefix = "ArticlesForm";

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    
    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-title"}
                    id="title"
                    type="text"
                    isInvalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Title is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="url">URL</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-url"}
                    id="url"
                    type="text"
                    isInvalid={Boolean(errors.url)}
                    {...register("url", {
                        required: "URL is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.url?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.url)}
                    {...register("explanation", {
                        required: "Explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-email"}
                    id="email"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("email", {
                        required: "email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateAdded">Date Added</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dateAdded"}
                    id="dateAdded"
                    type="datetime-local"
                    isInvalid={Boolean(errors.dateAdded)}
                    {...register("dateAdded", { 
                        required: true, pattern: isodate_regex 
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateAdded && "Date added is required."}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>
    );
}

export default ArticlesForm;
