import { Wallet, WalletContext } from '@solana/wallet-adapter-react'
import { FC, useContext, useMemo } from 'react'
import { Button, Modal, Stack } from 'react-bootstrap'
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
                <Button variant="secondary" className="w-75" onClick={() => onClose()}>
                    Got it
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const Wallets: FC<WalletProps> = ({ wallets, onSelect, select }) => (
    <Stack>
        {wallets.map(({ adapter }, index) => (
            <Stack onClick={() => onSelect(adapter)} key={index} direction="horizontal" gap={3}>
                <Image width="34" height="34" alt="Wallet" src={adapter.icon} />
                <div>{adapter.name}</div>
                <div className="ms-auto">{ select ? 'Detected' : 'Download' }</div>
            </Stack>
        ))}
    </Stack>
)

export default WalletAdapter
