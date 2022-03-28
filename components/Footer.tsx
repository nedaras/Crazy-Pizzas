import { faDiscord, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { FC } from 'react'
import { Button, Container, Stack } from 'react-bootstrap'

const Footer: FC = () => {
    return (
        <footer className="bg-dark text-center text-white">
            <Container className="pt-1">
                <Stack className="justify-content-center my-1" direction="horizontal" gap={3}>
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

            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                © 2020 Copyright
            </div>
        </footer>
    )
}

export default Footer
