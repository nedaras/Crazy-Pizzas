import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Dropdown } from 'react-bootstrap'

interface IconProps {
    href: string
    icon: IconProp
}

const Icons: FC = () => {
    return (
        <>
            <Icon href="https://twitter.com/CrazyPizzaNFT" icon={faTwitter}>
                Twitter
            </Icon>
            <Icon href="https://www.instagram.com/crazypizzanft/" icon={faInstagram}>
                Instagram
            </Icon>
            <Icon href="https://discord.gg/UmP8NnCQ" icon={faDiscord}>
                Discord
            </Icon>
        </>
    )
}

const Icon: FC<IconProps> = ({ children, href, icon }) => {
    return (
        <Dropdown.Item href={href}>
            <FontAwesomeIcon icon={icon} /> {children}
        </Dropdown.Item>
    )
}

export default Icons
