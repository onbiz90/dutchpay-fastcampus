import { CenteredOverlayForm } from "./shared/CenteredOverlayForm"
import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { useState } from "react"
import { groupNameState } from "../state/groupName"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { ROUTE_UTILS } from "../routes"
import { Form } from "react-bootstrap"
import { put } from 'aws-amplify/api';
import { groupIdState } from "../state/groupId"
import { useGroupData } from "../hooks/useGroupData"

export const AddMembers = () => {
    const { groupId, groupName, groupMembers } = useGroupData()
    const setGroupMembers = useSetRecoilState(groupMembersState)
    const [validated, setValidated] = useState(false)
    const [groupMembersString, setGroupMembersString] = useState('')
    const navigate = useNavigate()
    
    const saveGroupMembers = async () => {
        try {
            const restOperation = put({
                apiName: "groupsApi",
                path: `/groups/${groupId}/members`,
                options: {
                    body: {
                        members: groupMembers
                    }
                }
            });
            const response = await restOperation.response;
            console.log('Add Members PUT call succeeded: ', response);
            navigate(ROUTE_UTILS.EXPENSE_MAIN(groupId))
            // navigate(ROUTES.EXPENSE_MAIN)
            
        } catch (e) {
            const errorMessage = JSON.parse(e.response.body).error
            alert(errorMessage)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setValidated(true)
        // InputTags를 통해 입력된 경우
        if(groupMembers.length > 0){
            saveGroupMembers()
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
                    values={groupMembers}
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