import { CandyMachine } from '../libs/candy-machine'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { useEffect, useState } from 'react'
import { toDate } from '../libs/candy-machine-dd/utils'

export const MintButton = ({ onMint, candyMachine, isMinting }: { onMint: () => Promise<void>; candyMachine: CandyMachine | undefined; isMinting: boolean }) => {
    const { requestGatewayToken, gatewayStatus } = useGateway()
    const [ clicked, setClicked ] = useState(false)
    const [ isVerifying, setIsVerifying ] = useState(false)
    const [ isActive, setIsActive ] = useState(false) // true when countdown completes

    useEffect(() => {
        setIsVerifying(false)
        if (gatewayStatus === GatewayStatus.COLLECTING_USER_INFORMATION && clicked) {
            // when user approves wallet verification txn
            setIsVerifying(true)
        } else if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
            console.log('Verified human, now minting...')
            onMint()
            setClicked(false)
        }
    }, [ gatewayStatus, clicked, setClicked, onMint ])

    return (
        <button
            disabled={candyMachine?.state.isSoldOut || isMinting || !isActive || isVerifying}
            onClick={async () => {
                if (isActive && candyMachine?.state.gatekeeper && gatewayStatus !== GatewayStatus.ACTIVE) {
                    console.log('Requesting gateway token')
                    setClicked(true)
                    await requestGatewayToken()
                } else {
                    console.log('Minting...')
                    await onMint()
                }
            }}
        >
            {!candyMachine ? (
                'CONNECTING...'
            ) : candyMachine?.state.isSoldOut ? (
                'SOLD OUT'
            ) : isActive ? (
                isVerifying ? (
                    'VERIFYING...'
                ) : isMinting ? (
                    <p></p>
                ) : (
                    'MINT'
                )
            ) : candyMachine?.state.goLiveDate ? (
                <p></p>
            ) : (
                'UNAVAILABLE'
            )}
        </button>
    )
}
