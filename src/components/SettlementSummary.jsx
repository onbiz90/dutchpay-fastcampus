import { useRecoilValue } from "recoil"
import { expensesState } from "../state/expenses"
import { groupMembersState } from "../state/groupMembers"
import styled from "styled-components"
import { StyledTitle } from "./AddExpenseForm"
import { Button } from "react-bootstrap"
import { useRef } from "react"
import { toPng } from "html-to-image"
import { Download } from "react-bootstrap-icons"

export const calculateMinimumTransaction = (expenses, members, amountPerPerson) => {
    const minTransaction = []

    if (amountPerPerson === 0){
        return minTransaction
    }

    // 1. 사람별로 냈어야 할 금액
    const membersToPay = {}
    members.forEach(member => {
        membersToPay[member] = amountPerPerson
    })

    // 2. 사람별로 냈어야 하는 금액 업데이트
    expenses.forEach(({ payer, amount }) => {
        membersToPay[payer] -= amount
    })

    // 3. amount별로 오름차순 정렬된 리스트를 만든다.
    const sortedMembersToPay = Object.keys(membersToPay)
        .map(member => (
            {member: member, amount: membersToPay[member]}
        ))
        .sort((a, b) => a.amount - b.amount)

    // 4. 로직 구현
    var left = 0
    var right = sortedMembersToPay.length - 1

    while(left < right) {
        while(left < right && sortedMembersToPay[left].amount === 0){
            left += 1
        }

        while(left < right && sortedMembersToPay[right].amount === 0){
            right -= 1
        }
        
        const toReceive = sortedMembersToPay[left]
        const toSend = sortedMembersToPay[right]
        const amountToReceive = Math.abs(toReceive.amount)
        const amountToSend = Math.abs(toSend.amount)

        if (amountToSend > amountToReceive){
            minTransaction.push({
                receiver: toReceive.member,
                sender: toSend.member,
                amount: amountToReceive
            })

            toReceive.amount = 0
            // Send는 양수로 표현되기 때문에 빼야 한다.
            toSend.amount -= amountToReceive
            left += 1
        }

        // amountToSend <= amountToReceive
        else{
            minTransaction.push({
                receiver: toReceive.member,
                sender: toSend.member,
                amount: amountToSend
            })

            toSend.amount = 0
            // Receive는 음수로 표현되기 때문에 더해야 한다.
            toReceive.amount += amountToSend 
            right -= 1
        }

    }

    return minTransaction
}

export const SettlementSummary = () => {
    const wrapperElement = useRef(null)
    const expenses = useRecoilValue(expensesState)
    const members = useRecoilValue(groupMembersState)
    // const members = ["A", "B", "C", "D"]
    
    const totalExpenseAmount = expenses.reduce((prevAmount, curExpense) => prevAmount + parseInt(curExpense.amount), 0)
    const groupMembersCount = members.length
    const splitAmount = totalExpenseAmount / groupMembersCount

    // TODO. 핵심 로직 구현하기
    const minimumTransaction = calculateMinimumTransaction(expenses, members, splitAmount)

    const exportImage = () => {
        if(wrapperElement.current === null) {
            return
        }
    
        toPng(wrapperElement.current, {
            filter: (node) => node.tagName !== "BUTTON",
        })
            .then((dataURL) => {
                const link = document.createElement('a')
                link.download = "settlement-summary.png"
                link.href = dataURL
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <StyledWrapper ref={wrapperElement}>
            <StyledTitle>2. 정산은 이렇게!</StyledTitle>
            { totalExpenseAmount > 0 &&  groupMembersCount > 0 && (
                <>
                    
                    <StyledSummary>
                        <span>{groupMembersCount} 명이서 총 {totalExpenseAmount} 원 지출</span>
                        <br />
                        <span>한 사람 당 {splitAmount} 원</span>
                    </StyledSummary>
        
                    <StyledUl>
                        {minimumTransaction.map(({receiver, sender, amount}, index) => (
                            <li key={`transaction-${index}`}>
                                <span>{sender}가 {receiver}에게 {amount} 원 보내기</span>
                            </li>
                        ))}
                    </StyledUl>
                    <StyledButton data-testid="btn-download" onClick={exportImage}>
                        <Download />
                    </StyledButton>
                </>
            )}
        </StyledWrapper>
    )
}

const StyledButton = styled(Button)`
    background: none;
    border: none;
    font-size: 25px;
    position: absolute;
    top: 15px;
    right: 15px;

    &:hover, &:active{
        background: none;
        color: #683BA1;
    }
`

const StyledWrapper = styled.div`
    padding: 50px;
    background-color: #683BA1;
    color: #FFFBFB;
    box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    text-align: center;
    font-size: 22px;
    position: relative;
`

const StyledSummary = styled.div`
    margin-top: 31px;
`

const StyledUl = styled.ul`
    margin-top: 31px;
    font-weight: 600;
    line-height: 200%;

    list-style-type: disclosure-closed;
    li::marker {
        animation: blinker 1.5s linear infinite;
    }

    @keyframes blinker{
        50% {
            opacity: 0;
        }
    }
`