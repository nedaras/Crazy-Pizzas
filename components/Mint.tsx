import { FC, MouseEventHandler, useState, useMemo } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Carousel from 'react-bootstrap/Carousel'

import nft95 from '../public/nfts/images/95.png'
import Image from 'next/image'
import { useInterval } from '../hooks/useInterwal'

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement>
    remaining: number
    available: number
    price: number
    minting: boolean
    goLiveDate: number
}

interface MintButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
    minting: boolean
    soledOut: boolean
    price: number
    timeLeft: number
}

const Mint: FC<Props> = ({ remaining, available, onClick, price, minting, goLiveDate }) => {
    return (
        <Row className="align-items-center">
            <Slide />
            <Col md="6">
                <Card className="py-3 border-0">
                    <Card.Body className="text-center">
                        <h2>
                            {remaining}/{available}
                        </h2>
                        <p className="text-muted lead list-unstyled mb-0">MINTED</p>
                        <MintButton onClick={onClick} price={price} minting={minting} soledOut={remaining === 0} timeLeft={goLiveDate} />
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

const MintButton: FC<MintButtonProps> = ({ onClick, minting, soledOut, price, timeLeft }) => {
    const [ secondsLeft, setSecondsLeft ] = useState(getSecondsLeft(timeLeft))
    useInterval(() => setSecondsLeft(getSecondsLeft(timeLeft)), 1000)

    const counter = useMemo(() => {
        const { days, hours, minutes, seconds } = secondsToString(secondsLeft)
        const timer = `${days != 0 ? `${days}d ` : ''}${hours != 0 || days != 0 ? `${hours}h ` : ''}${minutes != 0 || days != 0 || hours != 0 ? `${minutes}m ` : ''}${seconds}s`

        return timer
    }, [ secondsLeft ])

    return (
        <Button className="w-75 px-5 mt-3 text-light" variant="info" size="lg" onClick={onClick} disabled={soledOut || minting || secondsLeft > 0}>
            {secondsLeft <= 0 ? (soledOut ? 'SOLED OUT' : minting ? 'MINTING...' : `MINT FOR ${price} SOL`) : counter}
        </Button>
    )
}

function getSecondsLeft(date: number) {
    const now = new Date()
    const seconds = Math.floor((date - now.getTime()) / 1000)

    return Math.max(seconds, -1)
}

function secondsToString(secondsLeft: number) {
    const days = Math.floor(secondsLeft / (3600 * 24))
    const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600)
    const minutes = Math.floor((secondsLeft % 3600) / 60)
    const seconds = secondsLeft % 60

    return {
        days,
        hours,
        minutes,
        seconds,
    }
}

export default Mint
