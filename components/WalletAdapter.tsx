import { WalletContext } from '@solana/wallet-adapter-react'
import { FC, useCallback, useContext } from 'react'
import { Button, Modal, Stack } from 'react-bootstrap'
import Image from 'next/image'
import { Adapter } from '@solana/wallet-adapter-base/lib/types'

interface Props {
    show: boolean
    onClose: () => void
    onSelect: (wallet: Adapter) => void
}

const WalletAdapter: FC<Props> = ({ show, onClose, onSelect }) => {
    const wallets = useContext(WalletContext).wallets

    const getActiveWallets = useCallback(() => {
        const _wallets = []
        for (const wallet of wallets) if (wallet.readyState == 'Installed') _wallets.push(wallet)
        return _wallets
    }, [])

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Wallet to connect with</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Stack>
                    {getActiveWallets().map(({ adapter }, index) => (
                        <Stack onClick={() => onSelect(adapter)} key={index} direction='horizontal' gap={3} >
                            <Image width="34" height="34" alt="Wallet" src={adapter.icon} />
                            <div>{adapter.name}</div>
                            <div className="ms-auto">Detected</div>
                        </Stack>
                    ))}
                </Stack>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" className="w-75" onClick={() => onClose()}>
                    Got it
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default WalletAdapter
