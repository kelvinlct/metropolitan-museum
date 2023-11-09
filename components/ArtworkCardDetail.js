import useSWR from 'swr';
import Error from 'next/error';
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { addToFavourites, removeFromFavourites } from '../lib/userData';

export default function ArtworkCard({objectID}){
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);
    const {data, error} = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

    useEffect(() => {
        setShowAdded(favouritesList.includes(objectID));
    }, [favouritesList, objectID]);

    const favouritesClicked = async () => {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(objectID));
            setShowAdded(false);
        } else {
            setFavouritesList(await addToFavourites(objectID));
            setShowAdded(true);
        }
    };

    if(error){
        return (<Error statusCode={404} />);
    }
    if (!data || data.length === 0) {
        return null;
    }
    return (
        <Card style={{ width: '18rem' }}>
            {data.primaryImage && (<Card.Img variant="top" src={data.primaryImage} />)}
            <Card.Body>
                <Card.Title>{data.title?data.title:"N/A"}</Card.Title>
                <Card.Text>
                    {data.objectDate?data.objectDate:"N/A"} <br/>
                    {data.classification?data.classification:"N/A"} <br/>
                    {data.medium?data.medium:"N/A"} <br/>
                    {data.artistDisplayName?data.artistDisplayName:"N/A"} <a href={data?.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> <br/>
                    {data.creditLine?data.creditLine:"N/A"} <br/>
                    {data.dimensions?data.dimensions:"N/A"}
                </Card.Text>
                <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>
                    {showAdded ? '+ Favourite (added)' : '+ Favourite'}
                </Button>
            </Card.Body>
        </Card>
    );
}
