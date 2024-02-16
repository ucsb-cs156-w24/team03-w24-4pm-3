import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function UCSBOrganizationsForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="UCSBOrganizationsForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationsForm-orgCode"
                            id="orgCode"
                            type="text"
                            isInvalid={Boolean(errors.orgCode)}
                            {...register("orgCode", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgCode && 'orgCode is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslationShort">Organization Translation Short</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationsForm-orgTranslationShort"
                            id="orgTranslationShort"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslationShort)}
                            {...register("orgTranslationShort", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslationShort && 'orgTranslationShort is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="orgTranslation">Organization Translation</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationsForm-orgTranslation"
                            id="orgTranslation"
                            type="text"
                            isInvalid={Boolean(errors.orgTranslation)}
                            {...register("orgTranslation", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.orgTranslation && 'orgTranslation is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

            <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="inactive">Organization Inactive</Form.Label>
                        <Form.Control
                            data-testid="UCSBOrganizationsForm-inactive"
                            id="inactive"
                            type="text"
                            isInvalid={Boolean(errors.inactive)}
                            {...register("inactive", { required: true, pattern: /(^true$|^false$)/g})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.inactive && 'inactive is required.'}
                            {errors.inactive?.type === 'pattern' && 'inactive must be in the format true or false'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="UCSBOrganizationsForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="UCSBOrganizationsForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default UCSBOrganizationsForm;
