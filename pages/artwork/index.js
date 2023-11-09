import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Col from "react-bootstrap/Col";
import ArtworkCard from "@/components/ArtworkCard";
import Row from "react-bootstrap/Row";
import Card from 'react-bootstrap/Card';
import Error from "next/error";
import Pagination from 'react-bootstrap/Pagination';
import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12;


export default function Artwork() {
    const router = useRouter();
    const [artworkList, setArtworkList] = useState([]);
    const [page, setPage] = useState(1);

    const finalQuery = router.asPath.split('?')[1];
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

    useEffect(() => {
        if (data) {
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            const results = [];
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }
            setArtworkList(results);
            setPage(1);
        }   
    }, [data]);

    const previousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };

    const nextPage = () => {
        if (page < artworkList.length) {
            setPage(prevPage => prevPage + 1);
        }
    };

    if (error) {
        return <Error statusCode={404} />;
    }

    if (artworkList && artworkList.length > 0) {
        return (
            <>
                <Row className="gy-4">
                    {artworkList[page - 1].map(currentObjectID => (
                        <Col lg={3} key={currentObjectID}>
                            <ArtworkCard objectID={currentObjectID} />
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col className="text-center">
                        <Pagination>
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>
                    </Col>
                </Row>
            </>
        );
    } else if (artworkList && artworkList.length === 0) {
        return (
            <Row className="gy-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <h4>Nothing Here</h4><br />
                                Try searching for something else
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }

    return null;
}