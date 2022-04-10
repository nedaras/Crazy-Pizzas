import type { FC } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

interface FieldProps {
    title: string
}

const Content: FC = ({ children }) => (
    <Row className="g-4 w-100" xs={{ cols: 1 }} md={{ cols: 2 }}>
        {children}
    </Row>
)

export const Field: FC<FieldProps> = ({ children, title }) => (
    <Col className="text-md-center">
        <h2>{title}</h2>
        <ul className="ps-3 ms-md-0 text-muted lead list-unstyled mt-2">{children}</ul>
    </Col>
)

export default Content
