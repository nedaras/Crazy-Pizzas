import { faTwitter, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { FC } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'

const Footer: FC = () => {
    return (
        <footer className="bg-dark text-center text-white">
            <Container className="p-1">
                <Stack className="justify-content-center" direction="horizontal" gap={3}>
                    <Button variant="dark" href="https://twitter.com/CrazyPizzaNFT">
                        <FontAwesomeIcon icon={faTwitter} />
                    </Button>
                    <Button variant="dark" href="https://www.instagram.com/crazypizzanft/">
                        <FontAwesomeIcon icon={faInstagram} />
                    </Button>
                    <Button variant="dark" href="https://discord.gg/UmP8NnCQ">
                        <FontAwesomeIcon icon={faDiscord} />
                    </Button>
                </Stack>
            </Container>
        </footer>
    )
}

export default Footer
