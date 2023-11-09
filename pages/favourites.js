import Error from "next/error";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ArtworkCard from '../components/ArtworkCard';
import { useAtom } from 'jotai';
import { favouritesAtom } from "../store";

export default function Favourites(){
    const [favouritesList] = useAtom(favouritesAtom);

    if (!favouritesList){
        return null;
    }

    if(favouritesList?.length == 0){
        return (
                <Card>
                    <Card.Body>
                        <b>Nothing Here.</b> Try adding some new artwork to the list.
                    </Card.Body>
                </Card>
            );
        }

    return (
        <Row>
            {favouritesList?.map((currentObjectID)=>(
                <Col lg={3} key={currentObjectID}>
                    <ArtworkCard objectID={currentObjectID} />
                </Col>))}
        </Row>
    )
}

