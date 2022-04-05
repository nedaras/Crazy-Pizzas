import { FC } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

interface Props {
    remaining: number
    available: number
    button: any
}

const Mint: FC<Props> = ({ remaining, available, children, button }) => {
    return (
        <Row className="align-items-center">
            <Col md="6">{children}</Col>
            <Col md="6">
                <Card className="py-3 border-0">
                    <Card.Body className="text-center">
                        <h2>
                            {remaining}/{available}
                        </h2>
                        <p className="text-muted lead list-unstyled mt-2">MINTED</p>
                        {button}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Mint
