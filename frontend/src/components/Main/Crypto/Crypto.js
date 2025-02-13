import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(190,190,190,0.22);
    cursor: pointer;
    background-color: ${({ theme }) => theme.primary};
    transition: all ease-in-out 300ms;
    &:hover {
        background-color: ${({ theme }) => theme.secondary};
    }
`

const Text = styled.h1`
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.textColor};
    margin: 0;
`

const Coin = styled.div`
    width: 30%;
    display: flex;
    align-items: center;
`

const CoinText = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
`

const CoinImg = styled.img`
    height: 35px;
    width: 35px;
`

const Ticket = styled(Text)`
    width: 15%;
`
const Price = styled(Text)`
    width: 10%;
`
const Volume = styled.div`
    width: 15%;
`

const Change = styled.div`
    width: 15%;
`

const MktCap = styled.div`
    display: flex;
    align-items: center;
`


function Crypto ({ data }) {
    const { coin, ticket, price, volume, change, mktcap } = data;

    return (
        <Container>
            <Coin>
                <CoinImg />
                <CoinText>
                    {coin}
                </CoinText>
            </Coin>
            <Ticket>{ticket}</Ticket>
            <Price>${price}</Price>
            <Volume>${volume}</Volume>
            <Change>${change}</Change>
            <MktCap>${mktcap}</MktCap>
        </Container>

    )
}

export default Crypto;