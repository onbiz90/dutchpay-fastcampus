import { Button, Container, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { OverlayWrapper } from "./OverlayWrapper"
import { ServiceLogo } from "./ServiceLogo"

export const CenteredOverlayForm = ({ title, children, validated, handleSubmit }) => {
    return (
        <StyledCenteralizedContainer>

            <ServiceLogo />

            <OverlayWrapper>
                <Container>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <StyledCentralizedContent>
                            <Row className="align-items-start">
                                <StyledTitle>{ title }</StyledTitle>
                            </Row>
                            <Row className="align-items-center">
                                { children }
                            </Row>
                            <Row className="align-items-end">
                                <StyledSubmitButton>저장</StyledSubmitButton>
                            </Row>
                        </StyledCentralizedContent>
                    </Form>
                </Container>
            </OverlayWrapper>
        </StyledCenteralizedContainer>
    )
}

const StyledCenteralizedContainer = styled(Container)`
    width: 50vw;
    @media (max-width: 500px){
        width: 80vw;
    }

    min-height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 10px;
`

const StyledTitle = styled.h2`
    font-weight: 700;
    line-height: 35px;
    text-align: right;
    overflow-wrap: break-word;
    word-break: keep-all;
`

const StyledSubmitButton = styled(Button).attrs({
    type: "submit"
})`
    background-color: #6610F2;
    border-radius: 8px;
    border: none;

    &:hover {
        background-color: #6610F2;
        filter: brightness(80%);
    }
`

const StyledCentralizedContent = styled(Row)`
    padding: ${(props) => props.padding || "5vw"};
    height: 60vh;
    justify-content: center;
    align-items: center;
`