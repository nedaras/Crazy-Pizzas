import { faDiscord, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { FC } from 'react'
import { Button, Container, Stack } from 'react-bootstrap'

const Footer: FC = () => {
    return (
        <footer className="bg-dark text-center text-white">
            <Container className="p-1">
                <Stack className="justify-content-center" direction="horizontal" gap={3}>
                    <Button variant="dark">
                        <Link passHref={true} href="https://twitter.com/CrazyPizzaNFT">
                            <FontAwesomeIcon icon={faTwitter} />
                        </Link>
                    </Button>

                    <Button variant="dark">
                        <Link passHref={true} href="https://www.instagram.com/crazypizzanft/">
                            <FontAwesomeIcon icon={faInstagram} />
                        </Link>
                    </Button>

                    <Button variant="dark">
                        <Link passHref={true} href="https://discord.gg/UmP8NnCQ">
                            <FontAwesomeIcon icon={faDiscord} />
                        </Link>
                    </Button>
                </Stack>
            </Container>
        </footer>
    )
}

export default Footer
