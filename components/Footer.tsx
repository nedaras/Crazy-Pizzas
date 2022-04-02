import { faDiscord, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { Button, Container, SSRProvider, Stack } from 'react-bootstrap'

const Footer: FC = () => {
    return (
        <SSRProvider>
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
        </SSRProvider>
    )
}

export default Footer
