import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { FC } from 'react'
import { Col, Container, Row, Card, Button, Carousel, ListGroup, ListGroupItem } from 'react-bootstrap'

import n15 from '../public/nfts/json/15.json'
import n7 from '../public/nfts/json/7.json'
import n58 from '../public/nfts/json/58.json'
import { CandyMachineState } from '../@types/candy-machine'
import { getData } from '../libs/fetch-data'

import nft7 from '../public/nfts/images/7.png'
import nft15 from '../public/nfts/images/15.png'
import nft58 from '../public/nfts/images/58.png'
import nft95 from '../public/nfts/images/95.png'
import Link from 'next/link'
import Mint from '../components/Mint'

interface Props {
    remaining: number
    available: number
}

interface Layers {
    background: string
    eyes: string
    mouth: string
    type: string
    toppings: string
    vegetables: string
}

interface PreviewProps {
    img: StaticImageData
    layers: Layers
}

interface PreviewsIngredientProps {
    text: string
    value: string
}

interface FieldProps {
    title: string
}

const Home: NextPage<Props> = ({ remaining, available }) => {
    return (
        <>
            <Container className="mw-xl mb-5">
                <Mint remaining={remaining} available={available} button={<MintButton />}>
                    <SlideShow />
                </Mint>
                <hr className="mb-5" />
                <Content />
                <hr className="my-5" />
                <Row className="justify-content-center g-3" xs="auto" md={{ cols: 2 }} lg={{ cols: 3 }}>
                    <Preview img={nft7} layers={n15} />
                    <Preview img={nft15} layers={n7} />
                    <Preview img={nft58} layers={n58} />
                </Row>
            </Container>
        </>
    )
}

const MintButton: FC = () => {
    return (
        <Link passHref href="/mint">
            <Button className="w-75 px-5 mt-3 text-light" variant="info" size="lg">
                GO TO MINT
            </Button>
        </Link>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const candyMachine = (await getData<CandyMachineState>(`http://${req.headers.host}/api/candy-machine/getState`)) as CandyMachineState

    return {
        props: { remaining: candyMachine.itemsRemaining, available: candyMachine.itemsAvailable },
    }
}

const SlideShow: FC = () => (
    <Carousel variant="dark">
        <Carousel.Item>
            <Image src={nft95} alt="Slide" />
        </Carousel.Item>

        <Carousel.Item>
            <Image src={nft95} alt="Slide" />
        </Carousel.Item>
        <Carousel.Item>
            <Image src={nft95} alt="Slide" />
        </Carousel.Item>

        <Carousel.Item>
            <Image src={nft95} alt="Slide" />
        </Carousel.Item>
        <Carousel.Item>
            <Image src={nft95} alt="Slide" />
        </Carousel.Item>
    </Carousel>
)

const Preview: FC<PreviewProps> = ({ img, layers }) => (
    <Col>
        <Card className="shadow-sm">
            <Image className="card-img" src={img} alt="NFT" />
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
