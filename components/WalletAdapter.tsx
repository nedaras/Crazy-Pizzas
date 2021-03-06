import { Wallet, WalletContext } from '@solana/wallet-adapter-react'
import { FC, useContext, useMemo } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Stack from 'react-bootstrap/Stack'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Badge from 'react-bootstrap/Badge'
import Image from 'next/image'
import { Adapter } from '@solana/wallet-adapter-base/lib/types'

interface WalletProps {
    wallets: Wallet[]
    onSelect: (wallet: Adapter) => void
    select: boolean
}

interface Props {
    show: boolean
    onClose: () => void
    onSelect: (wallet: Adapter) => void
    select: boolean
}

const WalletAdapter: FC<Props> = ({ show, onClose, onSelect, select }) => {
    const wallets = useContext(WalletContext).wallets

    const activeWallets = useMemo(() => {
        const _wallets = []
        for (const wallet of wallets) if (wallet.readyState == 'Installed') _wallets.push(wallet)
        return _wallets
    }, [ wallets ])

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{select ? 'Select Wallet to connect with' : 'You need to download a Wallet to continue'}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Wallets wallets={select ? activeWallets : wallets} onSelect={onSelect} select={select} />
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" className="w-100" onClick={() => onClose()}>
                    Got it
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const Wallets: FC<WalletProps> = ({ wallets, onSelect, select }) => (
    <ButtonGroup className="w-100" vertical>
        {wallets.map(({ adapter }, index) => (
            <Button variant="dark" key={index} href={select ? undefined : adapter.url}>
                <Stack onClick={select ? () => onSelect(adapter) : undefined} direction="horizontal" gap={3}>
                    <Image width="34" height="34" alt="Wallet" src={adapter.icon} />
                    <div>{adapter.name}</div>
                    <Badge className="ms-auto" bg="secondary">
                        {select ? 'Detected' : 'Download'}
                    </Badge>
                </Stack>
            </Button>
        ))}
    </ButtonGroup>
)

export default WalletAdapter
