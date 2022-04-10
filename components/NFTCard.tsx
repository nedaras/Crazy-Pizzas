import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import type { FC } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

interface Layers {
    background: string
    eyes: string
    mouth: string
    type: string
    toppings: string
    vegetables: string
}

interface Props {
    img: StaticImageData
    layers: Layers
}

interface CardIngredientProps {
    text: string
    value: string
}

const NFTCard: FC<Props> = ({ img, layers }) => (
    <Col>
        <Card className="shadow-sm">
            <Image className="card-img" src={img} alt="NFT" />
            <Card.Body>
                <Card.Title className="ms-1">Ingredients</Card.Title>
                <ListGroup>
                    <CardIngredient text="Background" value={layers.background} />
                    <CardIngredient text="Eyes" value={layers.eyes} />
                    <CardIngredient text="Mouth" value={layers.mouth} />
                    <CardIngredient text="Type" value={layers.type} />
                    <CardIngredient text="Toppings" value={layers.toppings} />
                    <CardIngredient text="Vegetables" value={layers.vegetables} />
                </ListGroup>
            </Card.Body>
        </Card>
    </Col>
)

const CardIngredient: FC<CardIngredientProps> = ({ text, value }) => (
    <ListGroup>
        <Row>
            <Col className="fw-bolder">{text}</Col>
            <Col className="text-end f-5">{value}</Col>
        </Row>
    </ListGroup>
)

export default NFTCard
