import { get } from "aws-amplify/api"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { groupNameState } from "../state/groupName"
import { groupIdState } from "../state/groupId"
import { groupMembersState } from "../state/groupMembers"
import { expensesState } from "../state/expenses"

export const useGroupData = () => {
    const { guid } = useParams()
    const [groupName, setGroupName] = useRecoilState(groupNameState)
    const [groupId, setGroupId] = useRecoilState(groupIdState)
    const [groupMembers, setMembers] = useRecoilState(groupMembersState)
    const [expenses, setExpenses] = useRecoilState(expensesState)

    const fetchAndSetGroupData = async () => {
        try{
            const { body } = await get({
                apiName: "groupsApi",
                path: `/groups/${guid}`
            }).response

            const { data } = await body.json()
            // groupName
            setGroupName(data.groupName)
            // groupId
            setGroupId(data.guid)
            // members
            setMembers(data.members || [])
            // expenses
            setExpenses(data.expenses || [])

        } catch (e){
            // const errorMessage = JSON.parse(e.response.body).error
            // console.log(errorMessage)
            alert("데이터를 불러오는데 실패했습니다.")
        }
    }

    useEffect(() => {
        if(guid?.length > 0) {
            fetchAndSetGroupData()
        }
    }, [guid])

    return {
        groupId,
        groupName,
        groupMembers,
        expenses
    }
}