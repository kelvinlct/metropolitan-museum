import React from 'react';
import useSWR from 'swr';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Error from 'next/error';
import Link from 'next/link';

export default function ArtworkCard({ objectID }) {
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
    if (error) {
        return (<Error statusCode={404} />);
    }
    if (!data) {
        return null;
    }

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={data.primaryImageSmall ? data.primaryImageSmall : `https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d`} />
            <Card.Body>
                <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                <Card.Text>
                    {data.objectDate ? data.objectDate : "N/A"} <br/>
                    {data.classification ? data.classification : "N/A"} <br/>
                    {data.medium ? data.medium : "N/A"} <br/>
                </Card.Text>
                <Link passHref href={`/artwork/${objectID}`}><Button variant="dark">{objectID}</Button></Link>
            </Card.Body>
        </Card>
    );

}