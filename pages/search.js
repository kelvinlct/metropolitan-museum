import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '@/lib/userData';

export default function AdvancedSearch() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            searchBy: 'title',
            geoLocation: '',
            medium: '',
            isOnView: false,
            isHighlight: false,
            q: ''
        },
    });

    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // Get reference to the search history
    const router = useRouter();

    const submitForm = async (data) => {
        const queryParts = [`${data.searchBy}=true`];

        if (data.geoLocation) {
            queryParts.push(`geoLocation=${data.geoLocation}`);
        }

        if (data.medium) {
            queryParts.push(`medium=${data.medium}`);
        }

        queryParts.push(`isOnView=${data.isOnView}`);
        queryParts.push(`isHighlight=${data.isHighlight}`);
        queryParts.push(`q=${data.q}`);

        const queryString = queryParts.join('&');
        setSearchHistory(await addToHistory(queryString)); // Add the current query string to the search history

        router.push(`/artwork?${queryString}`);
    }

    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Search Query</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your search query"
                            aria-label="Search Query"
                            {...register("q", { required: true })}
                            className={errors.q ? "is-invalid" : ""}
                        />
                        {errors.q && <div className="invalid-feedback">Please enter a search query.</div>}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Label>Search By</Form.Label>
                    <Form.Select {...register("searchBy")} className="mb-3" aria-label="Search By">
                        <option value="title">Title</option>
                        <option value="tags">Tags</option>
                        <option value="artistOrCulture">Artist or Culture</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Geo Location</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("geoLocation")}
                            aria-label="Geo Location"
                        />
                        <Form.Text className="text-muted">
                            Case Sensitive String (e.g. &quot;Europe&quot;, &quot;France&quot;,
                                &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;)
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Medium</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("medium")}
                            aria-label="Medium"
                        />
                        <Form.Text className="text-muted">
                            Case Sensitive String (e.g. &quot;Ceramics&quot;,
                                &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;)
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Check
                        type="checkbox"
                        label="Highlighted"
                        {...register("isHighlight")}
                        aria-label="Highlighted"
                    />
                    <Form.Check
                        type="checkbox"
                        label="Currently on View"
                        {...register("isOnView")}
                        aria-label="Currently on View"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{ margin: '1em 0' }} />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}