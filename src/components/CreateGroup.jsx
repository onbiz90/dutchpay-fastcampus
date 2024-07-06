import { Form } from "react-bootstrap"
import { CenteredOverlayForm } from "./shared/CenteredOverlayForm"
import { useRecoilState, useSetRecoilState } from "recoil"
import { groupNameState } from "../state/groupName"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES, ROUTE_UTILS } from "../routes"
import { post } from 'aws-amplify/api';
import { groupIdState } from "../state/groupId"


export const CreateGroup = () => {
    const [validated, setValidated] = useState(false)
    const [validGroupName, setValidGroupName] = useState(false)
    const setGroupId = useSetRecoilState(groupIdState)
    const [groupName, setGroupName] = useRecoilState(groupNameState)

    const navigate = useNavigate()

    const saveGroupName = async () => {
        try{
            const { body } = await post({
                apiName: "groupsApi",
                path: "/groups",
                options: {
                    body: {
                        groupName: groupName
                    }
                }
            }).response

            const data = await body.json()
            const { guid } = data.data
            
            setGroupId(guid)
            navigate(ROUTE_UTILS.ADD_MEMBERS(guid)) // ex. /groups/2222/members
            // navigate(ROUTES.ADD_MEMBERS)
        } catch (e){
            const errorMessage = JSON.parse(e.response.body).error
            alert(errorMessage)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const form = event.currentTarget
        
        if(form.checkValidity()){
            setValidGroupName(true)
            saveGroupName()
        } else {
            event.stopPropagation()
            setValidGroupName(false)
        }

        setValidated(true)
    }

    return (
        <CenteredOverlayForm
            title="먼저, 더치 페이 할 그룹의 이름을 정해볼까요?"
            validated={validated}
            handleSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Control
                    required
                    type="text"
                    placeholder="2022 제주도 여행"
                    onChange={(e) => {setGroupName(e.target.value)}}
                />
                <Form.Control.Feedback 
                    type="invalid"
                    data-valid={validGroupName}
                >
                    그룹 이름을 입력해 주세요.
                </Form.Control.Feedback>
            </Form.Group>
        </CenteredOverlayForm>
    )
}