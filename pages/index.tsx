import type { NextPage } from 'next'
import { FC } from 'react'
import { Col, Container, Row, Image, Card, Button, Carousel, ListGroup, ListGroupItem } from 'react-bootstrap'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Title from '../components/Title'

import n15 from '../public/nfts/json/15.json'
import n7 from '../public/nfts/json/7.json'
import n58 from '../public/nfts/json/58.json'

interface Layers {
    background: string
    eyes: string
    mouth: string
    type: string
    toppings: string
    vegetables: string
}

interface PreviewProps {
    img: string
    layers: Layers
}

interface PreviewsIngredientProps {
    text: string
    value: string
}

const Home: NextPage = () => {
    return (
        <>
            <Header />
            <Container className="py-5">
                <Row>
                    <Col className="text-center" sm="12" md="6">
                        <Title />
                        <SlideShow />
                        <h3 className="px-5">bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</h3>
                    </Col>
                    <Col>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</Col>
                </Row>
                <Row>
                    <Preview img="15" layers={n15} />
                    <Preview img="7" layers={n7} />
                    <Preview img="58" layers={n58} />
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center">
                        <Button href="/mint" className="px-5 mt-3 text-light" variant="info" size="lg">
                            GO TO MINT
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    )
}

const SlideShow: FC = () => (
    <Carousel>
        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/images/95.png" alt="First slide" />
        </Carousel.Item>

        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/images/95.png" alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/images/95.png" alt="First slide" />
        </Carousel.Item>

        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/images/95.png" alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/images/95.png" alt="First slide" />
        </Carousel.Item>
    </Carousel>
)

const Preview: FC<PreviewProps> = ({ img, layers }) => (
    <Col className="my-2" xs="12" md="4">
        <Card>
            <Card.Img src={`/nfts/images/${img}.png`} />
            <Card.Body>
                <Card.Title className="ms-1">Ingredients</Card.Title>
                <ListGroup>
                    <PreviewsIngredient text="Background" value={layers.background} />
                    <PreviewsIngredient text="Eyes" value={layers.eyes} />
                    <PreviewsIngredient text="Mouth" value={layers.mouth} />
                    <PreviewsIngredient text="Type" value={layers.type} />
                    <PreviewsIngredient text="Toppings" value={layers.toppings} />
                    <PreviewsIngredient text="Vegetables" value={layers.vegetables} />
                </ListGroup>
            </Card.Body>
        </Card>
    </Col>
)

const PreviewsIngredient: FC<PreviewsIngredientProps> = ({ text, value }) => (
    <ListGroupItem>
        <Row>
            <Col className="fw-bolder">{text}</Col>
            <Col className="text-end f-5">{value}</Col>
        </Row>
    </ListGroupItem>
)

export default Home
