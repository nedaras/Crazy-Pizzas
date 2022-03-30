import type { NextPage } from 'next'
import { Children, FC } from 'react'
import { Col, Container, Row, Image, Card, Button, Carousel, ListGroup, ListGroupItem } from 'react-bootstrap'
import Footer from '../components/Footer'
import Header from '../components/Header'

import n15 from '../public/nfts/json/15.json'
import n7 from '../public/nfts/json/7.json'
import n58 from '../public/nfts/json/58.json'
import { useCandyMachine } from '../hooks/useCandyMachine'

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

interface FieldProps {
    title: string
}

const Home: NextPage = () => {
    const [ candyMachine ] = useCandyMachine()

    return (
        <>
            <Header />
            <Container className="mw-xl mb-5">
                <Row className="align-items-center">
                    <Col md="6">
                        <SlideShow />
                    </Col>
                    <Col md="6" className="">
                        <Card className="py-3 border-0">
                            <Card.Body className="text-center">
                                <Card.Text>
                                    <h2>
                                        {candyMachine.remaining}/{candyMachine.available}
                                    </h2>
                                    <p className="text-muted lead list-unstyled mt-2">MINTED</p>
                                </Card.Text>
                                <Button href="/mint" className="w-75 px-5 mt-3 text-light" variant="info" size="lg">
                                    GO TO MINT
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <hr className="mb-5" />
                <Content />
                <hr className="my-5" />
                <Row className="justify-content-center g-3" xs="auto" md={{ cols: 2 }} lg={{ cols: 3 }}>
                    <Preview img="15" layers={n15} />
                    <Preview img="7" layers={n7} />
                    <Preview img="58" layers={n58} />
                </Row>
            </Container>

            <Footer />
        </>
    )
}



const SlideShow: FC = () => (
    <Carousel variant='dark' >
        <Carousel.Item>
            <Image src="/nfts/images/95.png" alt="First slide" fluid />
        </Carousel.Item>

        <Carousel.Item>
            <Image src="/nfts/images/95.png" alt="First slide" fluid />
        </Carousel.Item>
        <Carousel.Item>
            <Image src="/nfts/images/95.png" alt="First slide" fluid />
        </Carousel.Item>

        <Carousel.Item>
            <Image src="/nfts/images/95.png" alt="First slide" fluid />
        </Carousel.Item>
        <Carousel.Item>
            <Image src="/nfts/images/95.png" alt="First slide" fluid />
        </Carousel.Item>
    </Carousel>
)

const Preview: FC<PreviewProps> = ({ img, layers }) => (
    <Col>
        <Card className="shadow-sm">
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

const Content: FC = () => (
    <Row className="g-4 w-100" xs={{ cols: 1 }} md={{ cols: 2 }}>
        <Field title="About The Pizzas">
            <li>We all love pizzas so bou them suka nx.</li>
            <li>we will do some shit at stifff.</li>
            <li>we will do some shit at stifff.</li>
        </Field>
        <Field title="Notice">
            <li>
                One pizzas price is <strong>0.8 SOL</strong>.
            </li>
            <li>
                First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
            </li>
        </Field>
        <Field title="Something">
            <li>
                One pizzas price is <strong>0.8 SOL</strong>.
            </li>
            <li>
                First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
            </li>
        </Field>
        <Field title="Whats Next?">
            <li>
                One pizzas price is <strong>0.8 SOL</strong>.
            </li>
            <li>
                First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
            </li>
        </Field>
    </Row>
)

const Field: FC<FieldProps> = ({ children, title }) => (
    <Col className="text-md-center">
        <h2>{title}</h2>
        <ul className="ps-3 ms-md-0 text-muted lead list-unstyled mt-2">{children}</ul>
    </Col>
)

export default Home
