export interface IErrorResult {
    status?: number,
    error: string,
    description?: string
}

interface IErrorResultProps {
    errorMessage:IErrorResult
}
export function ErrorDialog({errorMessage}:IErrorResultProps) {
    return (<>
        <div style={{textAlign:"center"}}>
            <h2 data-testid="error_message">{errorMessage.error || "Unknown error occurred"}</h2>
            {errorMessage.description && <h3 data-testid="error_description">{errorMessage.description}</h3>}
        </div>
    </>)
}