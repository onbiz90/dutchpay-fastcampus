import { CenteredOverlayForm } from "./shared/CenteredOverlayForm"
import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { useState } from "react"
import { groupNameState } from "../state/groupName"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../routes"
import { Form } from "react-bootstrap"

export const AddMembers = () => {
    const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState)
    const [validated, setValidated] = useState(false)
    const groupName = useRecoilValue(groupNameState)
    const [groupMembersString, setGroupMembersString] = useState('')
    const navigate = useNavigate()
    
    const handleSubmit = (event) => {
        event.preventDefault()
        setValidated(true)
        // InputTags를 통해 입력된 경우
        if(groupMembers.length > 0){
            navigate(ROUTES.EXPENSE_MAIN)
        } 
        // 태그가 동작하지 않아 Form.Control을 통해 입력된 경우
        else if (isSamsungInternet && groupMembersString.length > 0){
            // Parse string > Array
            // setGroupMembers(Array)
            setGroupMembers(groupMembersString.split(","))
        }    
    }

    // TODO. Performance Optimization
    const isSamsungInternet = window.navigator.userAgent.includes("SAMSUNG") || window.navigator.userAgent.includes("SamsungBrowser")
    
    const header = `${groupName} 그룹에 속한 사람들의 이름을 모두 적어주세요.`

    return (
        <CenteredOverlayForm
            title={header}
            validated={validated}
            handleSubmit={handleSubmit}
        >
            { isSamsungInternet ?
                <Form.Control 
                    placeholder="이름 간 컴마(,)로 구분"
                    onChange={(event) => setGroupMembersString(event.target.value)}
                />
            :
                <InputTags 
                    placeholder="이름 간 띄어 쓰기" 
                    onTags={(value) => setGroupMembers(value.values)}
                />
            }
            
            {validated && groupMembers.length === 0 && (
                <StyledErrorMessage>그룹 멤버들의 이름을 입력해 주세요.</StyledErrorMessage>
            )}
        </CenteredOverlayForm>
    )
}

const StyledErrorMessage = styled.span`
    color: red;
`