import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { expensesState } from "../state/expenses"
import styled from "styled-components"
import { put } from 'aws-amplify/api';
import { groupIdState } from "../state/groupId"

export const AddExpenseForm = () => {
    // 비용 추가하기 입력 요소들 - 결제일, 비용에 대한 설명, 비용, 결제자
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, "0")
    const day = today.getDate().toString().padStart(2, "0")
    const [date, setDate] = useState([year, month, day].join("-"))
    const [desc, setDesc] = useState("")
    const [amount, setAmount] = useState(0)
    const [payer, setPayer] = useState(null)

    const setExpense = useSetRecoilState(expensesState)
    
    const members = useRecoilValue(groupMembersState)
    const guid = useRecoilValue(groupIdState)
    const [validated, setValidated] = useState(false)

    // 필수 입력 요소들에 대한 유효성을 검증하는 State
    const [isDescValid, setIsDescValid] = useState(false)
    const [isAmountValid, setIsAmountValid] = useState(false)
    const [isPayerValid, setIsPayerValid] = useState(false)

    const checkFormValidity = () => {
        const descValid = desc.length > 0
        const amountValid = amount > 0
        const payerValid = payer !== null

        setIsDescValid(descValid)  
        setIsAmountValid(amountValid)      
        setIsPayerValid(payerValid)

        return descValid && amountValid && payerValid
    }

    const saveExpense = async (expense) => {
        setExpense(expenses => [
            ...expenses,
            expense,
        ])
        
        try {
            const restOperation = put({
                apiName: "groupsApi",
                path: `/groups/${guid}/expenses`,
                options: {
                    body: {
                        expense: expense
                    }
                }
            });
            const response = await restOperation.response;
            console.log('PUT call succeeded: ', response);
        } catch (e) {
            const errorMessage = JSON.parse(e.response.body).error
            alert("비용 추가에 실패했습니다. 다시 시도해 주세요.")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(checkFormValidity()){
            const newExpense = {
                date, desc, amount, payer
            }

            saveExpense(newExpense)
            // const newExpense = {
            //     date, 
            //     desc, 
            //     amount, 
            //     payer
            // }
            
            // setExpense(expense => [
            //     ...expense,
            //     newExpense,
            // ])
        }

        setValidated(true)
    }
    
    return (
        <StyledWrapper>
            <Form noValidate onSubmit={handleSubmit}>
                <StyledTitle>1. 비용 추가하기</StyledTitle>
                <Row>
                    <Col xs={12}>
                        <StyledFormGroup>
                            <Form.Control
                                type="date"
                                placeholder="결제한 날짜를 선택해 주세요"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </StyledFormGroup>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={12}>
                        <StyledFormGroup>
                            <Form.Control
                                type="text"
                                placeholder="비용에 대한 설명을 입력해 주세요"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                isValid={isDescValid}
                                isInvalid={!isDescValid && validated}
                            />
                            <Form.Control.Feedback 
                                type="invalid"
                                data-valid={isDescValid}    
                            >
                                비용 내용을 입력해 주셔야 합니다.
                            </Form.Control.Feedback>
                        </StyledFormGroup>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={12} lg={6}>
                        <StyledFormGroup>
                            <Form.Control
                                type="number"
                                placeholder="비용은 얼마였나요?"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                isValid={isAmountValid}
                                isInvalid={!isAmountValid && validated}
                            />
                            <Form.Control.Feedback 
                                type="invalid"
                                data-valid={isAmountValid}
                            >
                                금액을 입력해 주셔야 합니다.
                            </Form.Control.Feedback>
                        </StyledFormGroup>
                    </Col>
                    
                    <Col xs={12} lg={6}>
                        <StyledFormGroup>
                            <Form.Select
                                defaultValue=""
                                onChange={(e) => setPayer(e.target.value)}
                                isValid={isPayerValid}
                                isInvalid={!isPayerValid && validated}
                            >
                                <option disabled value="">누가 결제 했나요?</option>
                                {members.map(member => 
                                    <option key={member} value={member}>{member}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback 
                                type="invalid"
                                data-valid={isPayerValid}
                            >
                                결제자를 선택해 주셔야 합니다.
                            </Form.Control.Feedback>
                        </StyledFormGroup>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={12} className="d-grid gap-2">
                        <StyledSubmitButton>추가하기</StyledSubmitButton>
                    </Col>
                </Row>
                
            </Form>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
    padding: 50px;
    border-radius: 15px;
    background: #683BA1;
    box-shadow: 3px 0px 4px 0px rgba(0, 0, 0, 0.25);
`

const StyledFormGroup = styled(Form.Group)`
    margin-bottom: 15px;

    input, select {
        background: #59359A;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        border: none;
        color: #F8F9FA;
        height: 45px;
    
        &:focus, &:hover {
            background: #59359A;
            color: #F8F9FA;
            filter: brightness(80%);
        }   
    }

    input::placeholder {
        color: #F8F9FA;
    }
`

export const StyledTitle = styled.h3`
    color: #FFFBFB;
    text-align: center;
    font-weight: 700;
    font-size: 40px;
    line-height: 40px;
    letter-spacing: 0.25px;
    margin-bottom: 15px;
`

const StyledSubmitButton = styled(Button).attrs({
    type: "submit"
})`
    width: 100%;
    height: 60px;
    padding: 16px 32px;
    border: 0px;
    border-radius: 8px;
    background-color: #E2D9F3;
    color: #59359A;
    margin-top: 10px;

    &:focus, &:hover {
        background-color: #E2D9F3;
        filter: rgba(0, 0, 0, 0.2);
    }
`

