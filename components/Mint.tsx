import type { FC, MouseEventHandler } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Carousel from 'react-bootstrap/Carousel'

import nft95 from '../public/nfts/images/95.png'
import Image from 'next/image'

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement>
    remaining: number
    available: number
    price: number
    minting: boolean
}

interface MintButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
    minting: boolean
    soledOut: boolean
    price: number
}

const Mint: FC<Props> = ({ remaining, available, onClick, price, minting }) => {
    return (
        <Row className="align-items-center">
            <Slide />
            <Col md="6">
                <Card className="py-3 border-0">
                    <Card.Body className="text-center">
                        <h2>
                            {remaining}/{available}
                        </h2>
                        <p className="text-muted lead list-unstyled mt-2">MINTED</p>
                        <MintButton onClick={onClick} price={price} minting={minting} soledOut={remaining === 0} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

const Slide: FC = () => (
    <Col md="6">
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
    </Col>
)

const MintButton: FC<MintButtonProps> = ({ onClick, minting, soledOut, price }) => {
    return (
        <Button className="w-75 px-5 mt-3 text-light" variant="info" size="lg" onClick={onClick} disabled={soledOut || minting}>
            {soledOut ? 'SOLED OUT' : minting ? 'MINTING...' : `MINT FOR ${price} SOL`}
        </Button>
    )
}

export default Mint
