import type { NextPage } from 'next'
import { FC } from 'react'
import { Col, Container, Row, Image, Card, Button, Carousel } from 'react-bootstrap'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Title from '../components/Title'

const Home: NextPage = () => {
    return (
        <>
            <Header />
            <Container className="mt-1">
                <Row className="text-light">
                    <Col className="text-center" sm="12" md="6">
                        <Title />
                        <SlideShow />
                        <h3 className="px-5">bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</h3>
                    </Col>
                    <Col>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</Col>
                </Row>
                <Row>
                    <Preview />
                    <Preview />
                    <Preview />
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
            <Image className="d-block w-100" src="/nfts/95.png" alt="First slide" />
        </Carousel.Item>

        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/95.png" alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/95.png" alt="First slide" />
        </Carousel.Item>

        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/95.png" alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
            <Image className="d-block w-100" src="/nfts/95.png" alt="First slide" />
        </Carousel.Item>
    </Carousel>
)

const Preview: FC = () => (
    <Col xs="12" md="4">
        <Card>
            <Card.Img src="/nfts/95.png" />
            <Card.Body>
                <Card.Title>Ingredients</Card.Title>
                <Card.Text>
                    <Row>
                        <Col>cool stuff</Col>
                        <Col className="text-end">cool stuff</Col>
                    </Row>
                </Card.Text>
            </Card.Body>
        </Card>
    </Col>
)

export default Home
